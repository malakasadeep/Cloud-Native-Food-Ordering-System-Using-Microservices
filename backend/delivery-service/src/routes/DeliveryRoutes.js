const express = require("express");
const DeliveryController = require("../controllers/DeliveryController");

const router = express.Router();

router.post("/start", DeliveryController.startToDelivery);
router.get(
  "/driver/:driverId",
  DeliveryController.getDeliverOrderBelongsToDriver
);
router.post("/", DeliveryController.createDelivery);

module.exports = router;
