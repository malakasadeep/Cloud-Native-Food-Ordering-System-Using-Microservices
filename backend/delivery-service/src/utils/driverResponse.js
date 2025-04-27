async function simulateDriverResponse(driverId, timeout = 300000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accepted = Math.random() < 0.3;
      resolve(accepted);
    }, 2000);
  });
}

module.exports = simulateDriverResponse;
