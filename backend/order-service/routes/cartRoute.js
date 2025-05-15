import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:customerId", getCart); // Get cart by customer ID
router.post("/", addToCart); // Add or update item in cart
router.delete("/", removeFromCart); // Remove specific item
router.delete("/:customerId", clearCart); // Clear all items

export default router;
