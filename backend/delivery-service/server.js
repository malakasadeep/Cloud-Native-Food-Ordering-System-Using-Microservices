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
const deliveryRoutes = require("./src/routes/DeliveryRoutes.js");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setupDriverSocket(io);

app.use("/api/delivery", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("Delivery service is running!");
});

const PORT = process.env.PORT || 8090;

const startServer = async () => {
  try {
    await connectToDb();
    server.listen(PORT, () => {
      console.log(`\x1b[34mServer running on port ${PORT}\x1b[0m`);
      console.log(
        `\x1b[32mSocket.IO available at ws://localhost:${PORT}\x1b[0m`
      );
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
