const Delivery = require("../models/Delivery");

const getCustomerIdByDriver = async (driverId) => {
  const delivery = await Delivery.findOne({
    driverId,
    delivery_status: "started",
  });
  console.log(delivery);
  return delivery?.customerId || null;
};

module.exports = { getCustomerIdByDriver };
