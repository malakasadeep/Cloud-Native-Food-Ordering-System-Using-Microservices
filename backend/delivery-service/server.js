const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectToDb = require("./src/config/dbConfig");
const { Server } = require("socket.io");
const http = require("http");
const { handleError } = require("./src/middlewares/errorMiddleware");
const setupDriverSocket = require("./src/sockets/driverSocket");

// Create express app
const app = express();

// CORS configurations
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middlewares
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(handleError);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
setupDriverSocket(io);

app.get("/", (req, res) => {
  res.send("Delivery service is running!");
});

const PORT = process.env.PORT || 8090;

const startServer = async () => {
  try {
    await connectToDb();
    // Use server.listen() instead of app.listen()
    server.listen(PORT, () => {
      console.log("\x1b[34m%s\x1b[0m", `Server Running On Port ${PORT}`);
      console.log(
        "\x1b[32m%s\x1b[0m",
        `Socket.IO available at ws://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error);
  }
};

startServer();
