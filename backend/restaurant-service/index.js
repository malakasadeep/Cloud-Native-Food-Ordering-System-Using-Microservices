import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import categoryRouter from "./routes/categoryRoutes.js";
import menuRouter from "./routes/foodMenuRoutes.js";

const app = express();

app.use(bodyParser.json());

app.use("/api/category", categoryRouter);
app.use("/api/foodMenu", menuRouter);

//MongoDB Connection
mongoose
  .connect(
    // "mongodb+srv://pgmsadeep:1234@cluster0.phudmlq.mongodb.net/FoodDelevery_DB?retryWrites=true&w=majority"
    "mongodb+srv://it22128454:NirashaShadini@cluster0.2js5i.mongodb.net/FoodDelevery_DB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the mongoDB");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
