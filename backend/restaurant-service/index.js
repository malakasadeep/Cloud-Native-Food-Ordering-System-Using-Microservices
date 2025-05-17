import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import categoryRouter from "./routes/categoryRoutes.js";
import menuRouter from "./routes/foodMenuRoutes.js";
import cors from "cors";

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    credentials: true, 
  })
);

app.use("/api/v1/restaurant/category", categoryRouter);
app.use("/api/v1/restaurant/foodMenu", menuRouter);

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'restaurant-service' });
});

//MongoDB Connection
mongoose
  .connect(
     "mongodb+srv://pgmsadeep:1234@cluster0.phudmlq.mongodb.net/FoodDelevery_DB?retryWrites=true&w=majority"
    //"mongodb+srv://it22128454:NirashaShadini@cluster0.2js5i.mongodb.net/FoodDelevery_DB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the mongoDB");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.listen(5002, () => {
  console.log("Server is running on port 5002");
});
