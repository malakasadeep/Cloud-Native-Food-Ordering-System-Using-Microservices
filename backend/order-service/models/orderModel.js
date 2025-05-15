import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerId: { type: String, required: true },
    items: [
      {
        // itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        itemId: { type: String, required: true },
        itemName: { type: String},
        unitPrice: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
      required: false,
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "PROCESSING", "COMPLETED", "CANCELLED"],
      default: "PLACED",
    },
    deliveryAddress: { type: String, required: true },
    paymentId: { type: String },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
