const axios = require("axios");
const Delivery = require("../models/Delivery.js");
const DeliveryRequest = require("../models/DeliveryRequest.js");
const haversineDistance = require("../utils/haversine");
const simulateDriverResponse = require("../utils/driverResponse");

async function getNearbyRiders(location, maxDistance = 100) {
  const { data } = await axios.get(
    `http://localhost:5001/api/v1/user/role/delivery_rider`
  );
  return data
    .filter((r) => r.currentLocation)
    .map((r) => ({
      ...r,
      distance: haversineDistance(location, r.currentLocation),
    }))
    .filter((r) => r.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

async function assignRider({
  orderId,
  customerId,
  resturentId,
  pickup_location,
  dropoff_location,
}) {
  const res = await axios.get(
    `http://localhost:5001/api/v1/user/${resturentId}`
  );

  console.log(res.data.data.restaurant);

  const restaurantLocation = res.data.data.restaurant.location;

  const riders = await getNearbyRiders(restaurantLocation);

  if (!riders.length) throw new Error("No nearby riders");

  const delivery = await new Delivery({
    orderId,
    customerId,
    resturentId,
    pickup_location,
    dropoff_location,
    delivery_status: "pending",
  }).save();

  for (const rider of riders) {
    const request = await new DeliveryRequest({
      deliveryId: delivery._id,
      driverId: rider._id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }).save();
  }

  const timeout = setTimeout(async () => {
    await Delivery.findByIdAndUpdate(delivery._id, {
      delivery_status: "canceled",
    });

    await DeliveryRequest.findByIdAndUpdate(request._id, {
      status: "rejected",
    });
    console.log(`Order ${orderId} canceled due to timeout`);
  }, 10 * 60 * 1000);

  return riders;
}

module.exports = {
  assignRider,
};
