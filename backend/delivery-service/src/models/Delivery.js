//models/Delivery.js
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resturentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    delivery_status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "started",
        "picked_up",
        "on_delivery",
        "delivered",
        "time_out",
        "failed",
      ],
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
