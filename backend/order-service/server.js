import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import orderRoutes from "./routes/orderRoute.js";
import cartRoutes from "./routes/cartRoute.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const DEFAULT_PORT = process.env.PORT || 5003;
const FALLBACK_PORT = 7002;

app.use("/api/v1/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

const startServer = (port) => {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
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
