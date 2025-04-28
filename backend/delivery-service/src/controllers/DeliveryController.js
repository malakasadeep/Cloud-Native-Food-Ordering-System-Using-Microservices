const Delivery = require("../models/Delivery.js");
const DeliveryRequest = require("../models/DeliveryRequest.js");
const { assignRider } = require("../services/delivery.service");

class DeliveryController {
  //after order payment created this will call
  static async startToDelivery(req, res, next) {
    try {
      const {
        orderId,
        customerId,
        resturentId,
        pickup_location,
        dropoff_location,
      } = req.body;

      const rider = await assignRider({
        orderId,
        customerId,
        resturentId,
        pickup_location,
        dropoff_location,
      });

      if (!rider) {
        return res.status(404).json({ message: "No rider assigned" });
      }

      res.status(200).json({
        message: "Rider assigned successfully",
        rider,
      });
    } catch (err) {
      next(err);
    }
  }

  //function too create delivery record manually
  static async createDelivery(req, res, next) {
    try {
      const {
        orderId,
        customerId,
        resturentId,
        driverId,
        pickup_location,
        dropoff_location,
      } = req.body;

      if (
        !orderId ||
        !customerId ||
        !resturentId ||
        !driverId ||
        !pickup_location ||
        !dropoff_location
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newDelivery = new Delivery({
        orderId,
        customerId,
        resturentId,
        driverId,
        pickup_location,
        dropoff_location,
        delivery_status: "pending",
      });

      const savedDelivery = await newDelivery.save();
      res.status(201).json(savedDelivery);
    } catch (error) {
      next(error);
    }
  }

  //get all deliveries belong to the rider
  static async getDeliverOrderBelongsToDriver(req, res, next) {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }

      const deliveryOrders = await Delivery.find({
        driverId: driverId,
        delivery_status: "assigned",
      }).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, data: deliveryOrders });
    } catch (error) {
      console.error("Error fetching deliveries for driver:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  //function to accept assigned delivery request
  static async driverAcceptOrder(req, res, next) {
    try {
      const { driverId, deliveryId } = req.params;

      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }

      // if (delivery.delivery_status === "accepted") {
      //   return res.status(400).json({ message: "Delivery already accepted" });
      // }

      await Delivery.findOneAndUpdate(
        { deliveryId: deliveryId },
        {
          driverId,
          delivery_status: "accepted",
          assignedAt: new Date(),
        }
      );

      await DeliveryRequest.findOneAndUpdate(
        { deliveryId, driverId },
        { status: "accepted" }
      );

      await DeliveryRequest.updateMany(
        { deliveryId, driverId: { $ne: driverId } },
        { status: "timeout" }
      );

      return res.status(200).json({
        success: true,
        message: "Driver accepted the delivery",
      });
    } catch (error) {
      console.error("Error in driverAcceptOrder:", error);

      next(error);
    }
  }

  static async getRiderAcceptedOrdersByStatus(req, res, next) {
    try {
      const { driverId, status } = req.params;

      if (!driverId) {
        return res.status(404).json({ message: "Driver Id is required" });
      }

      const orders = await Delivery.find({
        driverId: driverId,
        delivery_status: status,
      });

      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async riderStartDelivery(req, res, next) {
    try {
      const { deliveryId } = req.params;

      const deliveryLog = await Delivery.findById(deliveryId);

      if (!deliveryLog) {
        return res.status(404).json({ message: "Delivery not found" });
      }

      await Delivery.findByIdAndUpdate(deliveryId, {
        delivery_status: "started",
      });

      return res
        .status(200)
        .json({ success: true, message: "Delivery started successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getRiderOngoingOrder(req, res, next) {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        return res.status(404).json({ message: "Driver Id is required" });
      }

      const orders = await Delivery.find({
        driverId: driverId,
        delivery_status: { $in: ["started", "picked_up", "on_delivery"] },
      });

      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliveryController;
