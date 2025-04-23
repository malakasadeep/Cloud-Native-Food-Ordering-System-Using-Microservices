const { getCustomerIdByDriver } = require("../utils/activeDeliveryUtils");

const userSocketMap = {};

module.exports = function (io) {
  io.engine.on("connection_error", (err) => {
    console.log("Engine.IO error:", err);
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("register", ({ userId }) => {
      userSocketMap[userId] = socket.id;
      console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("driverLocation", async ({ driverId, location }) => {
      console.log(`📍 Driver ${driverId} sent location`, location);

      try {
        const customerId = await getCustomerIdByDriver(driverId);
        if (!customerId) {
          return console.log("❌ No active delivery found for driver");
        }

        const customerSocketId = userSocketMap[customerId];
        if (customerSocketId) {
          io.to(customerSocketId).emit("driverLocationUpdate", {
            driverId,
            location,
          });
          console.log(`📦 Location sent to customer ${customerId}`);
        } else {
          console.log(`❌ Customer ${customerId} not connected`);
        }
      } catch (err) {
        console.error("🚨 Error handling driver location:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected:", socket.id);
      for (const [userId, sockId] of Object.entries(userSocketMap)) {
        if (sockId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
  });
};
