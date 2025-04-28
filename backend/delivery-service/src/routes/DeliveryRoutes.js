const express = require("express");
const DeliveryController = require("../controllers/DeliveryController");

const router = express.Router();

router.post("/start", DeliveryController.startToDelivery);
router.get(
  "/driver/:driverId",
  DeliveryController.getDeliverOrderBelongsToDriver
);
router.post("/", DeliveryController.createDelivery);
router.get("/driver/start/:deliveryId", DeliveryController.riderStartDelivery);
router.get(
  "/accept/driver/:driverId/order/:deliveryId",
  DeliveryController.driverAcceptOrder
);
router.get(
  "/driver/:driverId/status/:status",
  DeliveryController.getRiderAcceptedOrdersByStatus
);

router.get("/start/order/:deliveryId", DeliveryController.riderStartDelivery);
router.get(
  "/ongoing/driver/:driverId",
  DeliveryController.getRiderOngoingOrder
);

module.exports = router;
