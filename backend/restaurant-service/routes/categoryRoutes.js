import express from "express";
import { addCategory, getAllCategories, removeCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

//addCategory
categoryRouter.post("/", addCategory);

//getAllCategories  
categoryRouter.get("/", getAllCategories);

//getCategoriesByRestaurant
categoryRouter.get("/:restaurantId", getAllCategories);

//removeCategory
categoryRouter.delete("/remove/:categoryId", removeCategory);

export default categoryRouter;