const mongoose = require("mongoose");

const DeliveryRequestSchema = new mongoose.Schema({
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "timeout", "cancelled"],
    default: "pending",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 6000,
  },
});

module.exports = mongoose.model("DeliveryRequest", DeliveryRequestSchema);
