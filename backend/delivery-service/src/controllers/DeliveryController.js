//controllers/DeliveryController.js
const Delivery = require("../models/Delivery.js");
const axios = require("axios");

class DeliveryController {
  static async startToDelivery(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).json({ message: "Order Id is Required" });
      }

      const orderRes = await axios.get(
        `http://localhost:5002/api/orders/${id}`
      );

      console.log(orderRes); //loger for debugging
    } catch (error) {}
  }
}
