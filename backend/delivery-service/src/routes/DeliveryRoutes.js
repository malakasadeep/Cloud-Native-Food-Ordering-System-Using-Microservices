const express = require("express");
const DeliveryController = require("../controllers/DeliveryController");

const router = express.Router();

router.get("/:resturentId", DeliveryController.startToDelivery);
router.post("/", DeliveryController.createDelivery);

module.exports = router;
