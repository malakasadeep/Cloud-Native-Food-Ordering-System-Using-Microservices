import express from "express";
import {
  placeOrder,
  updateOrder,
  cancelOrder,
  trackOrder,
  createPaymentIntent,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js"; // Make sure this is also an ES module

const router = express.Router();

router.post("/create-order", placeOrder); // Place Order
router.post("/create-checkout-session", createPaymentIntent); // Place Order
router.get("/", getAllOrders); // Get All Orders
router.post("/status/:orderId", updateOrderStatus); // Update Order Status
router.get("/:id", getOrderById); // Get Order by ID
router.put("/:orderId", updateOrder); // Update Order
router.delete("/:orderId", cancelOrder); // Cancel Order
router.get("/:orderId", trackOrder); // Track Order

export default router;
