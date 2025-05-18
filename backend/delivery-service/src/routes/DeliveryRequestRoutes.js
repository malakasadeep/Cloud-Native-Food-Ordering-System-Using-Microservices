const express = require("express");
const DeliveryRequestController = require("../controllers/DeliveryRequestController");

const router = express.Router();

router.get("/:riderId", DeliveryRequestController.getDeliveryRequestByRider);

module.exports = router;
