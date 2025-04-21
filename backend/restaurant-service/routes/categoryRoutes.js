import express from "express";
import { addCategory, removeCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

//addCategory
categoryRouter.post("/add", addCategory);

//removeCategory
categoryRouter.delete("/remove/:categoryId", removeCategory);

export default categoryRouter;