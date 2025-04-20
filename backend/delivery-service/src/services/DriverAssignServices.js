//services/DriverAssignServices.js

function getNearestDriver(drivers, restaurantLocation) {
  let nearestDriver = null;
  let shortestDistance = Infinity;

  drivers.forEach((driver) => {
    const dist = calculateHaversineDistance(
      restaurantLocation.lat,
      restaurantLocation.lng,
      driver.lat,
      driver.lng
    );
    if (dist < shortestDistance && driver.available) {
      shortestDistance = dist;
      nearestDriver = driver;
    }
  });

  return nearestDriver;
}
