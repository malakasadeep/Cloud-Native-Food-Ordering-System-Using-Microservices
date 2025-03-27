import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js";
import http from "http";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const DEFAULT_PORT = process.env.PORT || 5001;
const FALLBACK_PORT = 7001;

app.use("/api/v1/auth", authRoutes);

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
      startServer(FALLBACK_PORT); // Retry with fallback port
    } else {
      console.error("Server error:", err);
    }
  });
};

dbConnect().then(() => {
  startServer(DEFAULT_PORT);
});
