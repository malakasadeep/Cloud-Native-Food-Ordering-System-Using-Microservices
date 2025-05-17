const Delivery = require("../models/Delivery.js");
const DeliveryRequest = require("../models/DeliveryRequest.js");
const { assignRider } = require("../services/delivery.service");
const axios = require("axios");

class DeliveryController {
  //after order payment created this will call
  static async startToDelivery(req, res, next) {
    try {
      const { orderId, customerId, resturentId } = req.body;

      console.log(req.body);

      const rider = await assignRider({
        orderId,
        customerId,
        resturentId,
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

  static async getAllDeliveryLogs(req, res, next) {
    try {
      const deliveryLogs = await Delivery.find();
      res.status(200).json(deliveryLogs);
    } catch (error) {
      console.error("Error fetching delivery logs:", error);
      next(error);
    }
  }

  static async getAllDeliveryOrdersByCustomer(req, res, next) {
    const { customerId } = req.params;

    try {
      const ordersResponse = await axios.get(
        `http://order-service:5003/api/v1/orders/customer/${customerId}`
      );

      const orders = ordersResponse.data.orders;

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this customer" });
      }

      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const deliveryLogs = await Delivery.find({ orderId: order._id });
          return {
            ...order,
            deliveryLogs,
          };
        })
      );

      res.status(200).json({ orders: enrichedOrders });
    } catch (error) {
      next(error);
    }
  }

  static async completeOngoingDelivery(req, res, next) {
    try {
      const { deliveryId } = req.params;

      const deliveryLog = await Delivery.findById(deliveryId);
      if (!deliveryLog) {
        return res.status(404).json({ message: "Delivery log not found" });
      }

      const orderId = deliveryLog.orderId;

      deliveryLog.delivery_status = "delivered";
      await deliveryLog.save();

      const ordersResponse = await axios.post(
        `http://order-service:5003/api/v1/orders/status/${orderId}`,
        {
          newStatus: "DELIVERED",
        }
      );

      res.status(200).json({
        message: "Delivery marked as completed and order updated",
        delivery: deliveryLog,
        orderUpdate: ordersResponse.data,
      });
    } catch (error) {
      next(error);
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

      console.log(driverId, deliveryId);

      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        return res.status(400).json({ message: "Delivery not found" });
      }

      // if (delivery.delivery_status === "accepted") {
      //   return res.status(400).json({ message: "Delivery already accepted" });
      // }

      await Delivery.findOneAndUpdate(
        { _id: deliveryId },
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
