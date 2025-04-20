//models/Delivery.js
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    delivery_status: {
      type: String,
      enum: ["pending", "assigned", "picked_up", "delivered", "failed"],
      default: "pending",
    },
    pickup_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    assignedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
