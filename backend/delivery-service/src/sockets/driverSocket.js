module.exports = function (io) {
  // Add engine-level error logging
  io.engine.on("connection_error", (err) => {
    console.log("Engine.IO error:", err);
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("driverLocation", (data) => {
      console.log("📍 Driver location:", data);
      io.emit("driverLocationUpdate", data);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });
};
