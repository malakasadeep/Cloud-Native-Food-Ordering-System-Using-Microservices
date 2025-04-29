import Stripe from "stripe";
import Order from "../models/orderModel.js";

import dotenv from "dotenv";
dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { cartItems } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `http://localhost:5173/customer/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            id: item._id,
            restaurantId: item.restaurantId,
            name: item.name,
            price: item.price,
            qty: item.qty,
          }))
        ),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Place a New Order
export const placeOrder = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const cartItemsRaw = session.metadata.cartItems
      ? JSON.parse(session.metadata.cartItems)
      : [];
    // console.log(cartItemsRaw);

    const cartItemsFormatted = cartItemsRaw.map((item) => ({
      itemName: item.title,
      itemId: item.id,
      unitPrice: item.price,
      qty: item.qty,
    }));

    const totalAmount = cartItemsFormatted.reduce(
      (sum, item) => sum + item.unitPrice * item.qty,
      0
    );
    
    const orderData = {
      customerId:
        session.client_reference_id ??
        Math.random().toString(36).substring(2, 15),
      items: cartItemsFormatted,
      totalAmount: totalAmount,
      paymentMethod: "Card",
      deliveryAddress: "address",
      paymentStatus: "PAID",
      // cardInfo: paymentMethod === "Card" ? cardInfo : undefined,
    };

    if (session.payment_status === "paid") {
    }

    const newOrder = await Order.create(orderData);

    // === Notification Part ===
    // const user = await User.findById(customerId);
    // if (user) {
    //   await sendEmail(
    //     user.email,
    //     "Order Confirmation",
    //     `Hi ${user.name}, your order (ID: ${newOrder._id}) has been placed successfully!`
    //   );

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

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Newest orders first

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
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
