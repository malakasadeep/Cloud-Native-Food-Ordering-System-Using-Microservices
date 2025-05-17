const express = require("express");
const DeliveryController = require("../controllers/DeliveryController");
const DeliveryRequestController = require("../controllers/DeliveryRequestController");

const router = express.Router();

router.post("/assign", DeliveryController.startToDelivery);
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
router.get(
  "/request/:riderId",
  DeliveryRequestController.getDeliveryRequestByRider
);

router.get("/logs/all", DeliveryController.getAllDeliveryLogs);

router.get(
  "/delivery-requests/delivery/:deliveryId",
  DeliveryRequestController.getAllPendingDeliveryRequestByDeliveryId
);

router.get(
  "/customer/:customerId",
  DeliveryController.getAllDeliveryOrdersByCustomer
);

router.get("/stop/:deliveryId", DeliveryController.completeOngoingDelivery);

module.exports = router;
