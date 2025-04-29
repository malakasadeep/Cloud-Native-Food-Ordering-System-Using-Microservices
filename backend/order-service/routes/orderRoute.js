import express from "express";
import {
  placeOrder,
  updateOrder,
  cancelOrder,
  trackOrder,
  createPaymentIntent,
  getAllOrders
} from "../controllers/orderController.js"; // Make sure this is also an ES module

const router = express.Router();


router.post("/", placeOrder);             // Place Order
router.post("/create-checkout-session", createPaymentIntent);             // Place Order
router.get("/", getAllOrders); // Get All Orders
router.put("/:orderId", updateOrder);     // Update Order
router.delete("/:orderId", cancelOrder);  // Cancel Order
router.get("/:orderId", trackOrder);      // Track Order

export default router; 