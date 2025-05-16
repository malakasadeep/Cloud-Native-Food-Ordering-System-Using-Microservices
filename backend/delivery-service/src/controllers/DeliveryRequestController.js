const DeliveryRequest = require("../models/DeliveryRequest.js");

class DeliveryRequestController {
  static async getDeliveryRequestByRider(req, res, next) {
    try {
      const { riderId } = req.params;

      const deliveryRequests = await DeliveryRequest.find({
        driverId: riderId,
        status: "pending",
      }).populate("deliveryId");

      if (!deliveryRequests || deliveryRequests.length === 0) {
        return res
          .status(404)
          .json({ message: "No pending delivery requests found" });
      }

      res.status(200).json({ success: true, data: deliveryRequests });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliveryRequestController;
