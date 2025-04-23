import Category from "../models/category.js";

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { restaurantId, categoryName } = req.body;

    const newCategory = new Category({ restaurantId, categoryName });
    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding category", error: error.message });
  }
};

// Remove a category by ID
export const removeCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing category", error: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId || req.query.restaurantId;
    
    let categories;
    if (restaurantId) {
      categories = await Category.find({ restaurantId });
    } else {
      categories = await Category.find();
    }
    
    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: error.message });
  }
};
