const DeliveryRequest = require("../models/DeliveryRequest.js");

class DeliveryRequestController {
  //get delivery request belongs to the rider
  static async getDeliveryRequestByRider(req, res, next) {
    try {
      const { riderId } = req.params;

      const deliveryRequests = await DeliveryRequest.findAll({
        driverId: riderId,
      });

      if (!deliveryRequests) {
        return res.status(404).json({ message: "Delivery Request Not Found" });
      }

      res.status(200).json({ success: true, data: deliveryRequests });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliveryRequestController;
