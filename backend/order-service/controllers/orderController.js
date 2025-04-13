import Order from "../models/orderModel.js";
import { createStripePayment } from "../controllers/paymentController.js";
import { sendEmail } from "../controllers/notificationController.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const payment = await createStripePayment(totalAmount);
    res.status(200).json(payment); // clientSecret is used by frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Place a New Order
export const placeOrder = async (req, res) => {
  try {
    const {
      customerId,
      items,
      totalAmount,
      paymentMethod,
      cardInfo,
      deliveryAddress,
    } = req.body;

    // Handle card info only if payment method is "Card"
    const orderData = {
      customerId,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      paymentStatus: paymentMethod === "Card" ? "PAID" : "PENDING",
      cardInfo: paymentMethod === "Card" ? cardInfo : undefined,
    };

    const newOrder = await Order.create(orderData);

    // === Notification Part ===
    const user = await User.findById(customerId);
    if (user) {
      await sendEmail(
        user.email,
        "Order Confirmation",
        `Hi ${user.name}, your order (ID: ${newOrder._id}) has been placed successfully!`
      );

      // await sendSMS(
      //   user.phone,
      //   `Order placed successfully! Order ID: ${newOrder._id}`
      // );
    }

    // Simulated delivery notification
    // await sendEmail(
    //   "deliveryguy@email.com",
    //   "New Order Assigned",
    //   `New order (ID: ${newOrder._id}) is ready for delivery to ${newOrder.deliveryAddress}.`
    // );

    // === End Notification ===

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Order Before Confirmation
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, totalAmount, paymentMethod, cardInfo, deliveryAddress } =
      req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: "PLACED" }, // Only allow changes if the order is "PLACED"
      {
        items,
        totalAmount,
        paymentMethod,
        cardInfo: paymentMethod === "Card" ? cardInfo : undefined,
        deliveryAddress,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(400).json({
        message: "Order cannot be updated at this stage.",
      });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const canceledOrder = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: "PLACED" },
      { orderStatus: "CANCELLED" },
      { new: true }
    );

    if (!canceledOrder) {
      return res.status(400).json({ message: "Order cannot be cancelled." });
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      order: canceledOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track Order Status
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
