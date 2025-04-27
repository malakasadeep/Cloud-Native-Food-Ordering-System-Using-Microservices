// src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import io from "socket.io-client";

const GOOGLE_MAPS_API_KEY = "AIzaSyCUNJVymb9TyStgPqJSE5Ond4dZHn7fwZU";
const SOCKET_URL = "http://localhost:8090";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const centerFallback = {
  lat: 6.9271,
  lng: 79.8612,
};

const OrderTrackingPage = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  const socketRef = useRef(null); // Use a ref to avoid reinitializing

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to socket server");

      // Register customer ID
      socket.emit("register", {
        userId: "6808dfac50ce43cfddea0ea7", // Replace dynamically if needed
      });
    });

    // ✅ Listen to the correct event name
    socket.on("driverLocationUpdate", (data) => {
      console.log("📍 Received driver location:", data);

      if (data?.location) {
        setDriverLocation(data.location);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onLoad = useCallback((map) => {
    console.log("🗺️ Map loaded");
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="p-20">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLocation || centerFallback}
        zoom={14}
        onLoad={onLoad}
      >
        {driverLocation && <Marker position={driverLocation} label="🚗" />}
      </GoogleMap>
    </div>
  );
};

export default OrderTrackingPage;
