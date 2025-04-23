import express from "express";
import {addFoodMenu, updateFoodMenu, deleteFoodMenu, getAllFoodMenus, getFoodMenuById, getFoodMenusByCategory, searchFoodMenus, getFoodMenusByRestaurantId} from "../controllers/foodMenuController.js";

const menuRouter = express.Router();

//addFoodMenu
menuRouter.post("/", addFoodMenu);

//updateFoodMenu
menuRouter.put("/update/:foodMenuId", updateFoodMenu);

//deleteFoodMenu
menuRouter.delete("/delete/:foodMenuId", deleteFoodMenu);

//getAllFoodMenu
menuRouter.get("/", getAllFoodMenus);

menuRouter.get("/:id", getFoodMenusByRestaurantId);

//getFoodMenuById
menuRouter.get("/:foodMneuId", getFoodMenuById);

//getFoodMenusByCategory
menuRouter.get("/category/:categoryId", getFoodMenusByCategory);

//searchFoodMenus
menuRouter.search("/search", searchFoodMenus);

export default menuRouter;