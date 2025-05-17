import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import customerRoutes from "./routes/customerRoute.js";
import userRoutes from "./routes/userRoute.js";
import http from "http";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());

const DEFAULT_PORT = process.env.PORT || 5001;
const FALLBACK_PORT = 7001;

app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/user", userRoutes);

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-service' });
});

const startServer = (port) => {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`User Service running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${port} is already in use. Trying port ${FALLBACK_PORT}...`
      );
      startServer(FALLBACK_PORT);
    } else {
      console.error("Server error:", err);
    }
  });
};

dbConnect().then(() => {
  startServer(DEFAULT_PORT);
});
