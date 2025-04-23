const Delivery = require("../models/Delivery.js");
const axios = require("axios");

function haversineDistance(coord1, coord2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

class DeliveryController {
  static async startToDelivery(req, res, next) {
    try {
      const { resturentId } = req.params;

      if (!resturentId) {
        return res.status(404).json({ message: "Resturent Id is Required" });
      }

      const resturentRes = await axios.get(
        `http://localhost:5001/api/v1/user/${resturentId}`
      );
      const restaurantLocation = resturentRes.data.restaurant.location;

      const ridersRes = await axios.get(
        `http://localhost:5001/api/v1/user/role/delivery_rider`
      );
      const deliveryRiders = ridersRes.data;

      let closestRider = null;
      let minDistance = Infinity;

      for (const rider of deliveryRiders) {
        const riderLoc = rider.currentLocation;
        if (!riderLoc) continue;

        const distance = haversineDistance(restaurantLocation, riderLoc);
        if (distance < minDistance) {
          minDistance = distance;
          closestRider = rider;
        }
      }

      if (!closestRider) {
        return res
          .status(404)
          .json({ message: "No available delivery rider found" });
      }

      res.status(200).json({
        message: "Delivery rider assigned",
        rider: closestRider,
        distance: minDistance.toFixed(2) + " km",
      });
    } catch (error) {
      next(error);
    }
  }

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
}

module.exports = DeliveryController;
