const axios = require("axios");
const Delivery = require("../models/Delivery.js");
const DeliveryRequest = require("../models/DeliveryRequest.js");
const haversineDistance = require("../utils/haversine");
const simulateDriverResponse = require("../utils/driverResponse");

async function getNearbyRiders(location, maxDistance = 100) {
  const { data } = await axios.get(
    `http://user-service:5001/api/v1/user/role/delivery_rider`
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

async function assignRider({ orderId, customerId, resturentId }) {
  let customer;
  let resturent;

  try {
    resturent = await axios.get(
      `http://user-service:5001/api/v1/user/${resturentId}`
    );
  } catch (error) {
    console.error("Failed to fetch customer:", error.message);
    throw error;
  }

  try {
    customer = await axios.get(
      `http://user-service:5001/api/v1/customer/${customerId}`
    );
  } catch (error) {
    console.error("Failed to fetch customer:", error.message);
    throw error;
  }

  console.log(resturent.data.data.restaurant);
  console.log(customer.data);

  const restaurantLocation = resturent.data.data.restaurant.location;
  const customerLocation = customer.data.location;

  console.log(customerLocation);

  const riders = await getNearbyRiders(restaurantLocation);

  if (!riders.length) throw new Error("No nearby riders");

  const delivery = await new Delivery({
    orderId,
    customerId,
    resturentId,
    pickup_location: restaurantLocation,
    dropoff_location: {
      lat: customerLocation.latitude,
      lng: customerLocation.longitude,
    },
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
