import Category from "../models/category.js";
import FoodMenu from "../models/foodmenu.js";
import mongoose from "mongoose";

// Add a new food menu
export const addFoodMenu = async (req, res) => {
  try {
    const {
      restaurantId,
      categoryName,
      name,
      price,
      description,
      availability,
      imageUrl,
    } = req.body;

    const newFoodMenu = new FoodMenu({
      restaurantId,
      categoryName,
      name,
      price,
      description,
      availability,
      imageUrl,
    });
    await newFoodMenu.save();

    res
      .status(201)
      .json({ message: "Food menu added successfully", foodMenu: newFoodMenu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding food menu", error: error.message });
  }
};

// Update food menu
export const updateFoodMenu = async (req, res) => {
  try {
    const { foodMenuId } = req.params;
    const updatedFoodMenu = await FoodMenu.findByIdAndUpdate(
      foodMenuId,
      req.body,
      { new: true }
    );

    if (!updatedFoodMenu) {
      return res
        .status(404)
        .json({ message: "Food menu not found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Food menu updated",
      foodMenu: updatedFoodMenu,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating food menu",
      error: error.message,
      success: false,
    });
  }
};

// Delete food menu
export const deleteFoodMenu = async (req, res) => {
  try {
    const { foodMenuId } = req.params;
    const deletedFoodMenu = await FoodMenu.findByIdAndDelete(foodMenuId);

    if (!deletedFoodMenu) {
      return res.status(404).json({ message: "Food menu not found" });
    }

    res.status(200).json({ message: "Food menu deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting food menu", error: error.message });
  }
};

// Get all food menus
export const getAllFoodMenus = async (req, res) => {
  try {
    const foodMenus = await FoodMenu.find();
    res.status(200).json(foodMenus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food menus", error: error.message });
  }
};

// Get food menu by ID
export const getFoodMenuById = async (req, res) => {
  try {
    const { foodMenuId } = req.params;
    const foodMenu = await FoodMenu.findById(foodMenuId);

    if (!foodMenu) {
      return res.status(404).json({ message: "Food menu not found" });
    }

    res.status(200).json(foodMenu);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food menu", error: error.message });
  }
};

// Get food menus by category
export const getFoodMenusByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const foodMenus = await FoodMenu.find({ categoryId });

    res.status(200).json(foodMenus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food menus", error: error.message });
  }
};

// Get food menus by restaurant ID
export const getFoodMenusByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foodMenus = await FoodMenu.find({ restaurantId });

    res.status(200).json(foodMenus);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching restaurant menus",
      error: error.message,
    });
  }
};

// Search food menus
export const searchFoodMenus = async (req, res) => {
  try {
    const { query } = req.query;
    const foodMenus = await FoodMenu.find({
      name: { $regex: query, $options: "i" },
    });

    res.status(200).json(foodMenus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching food menus", error: error.message });
  }
};
