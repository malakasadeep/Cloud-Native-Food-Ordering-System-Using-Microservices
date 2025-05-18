import React, { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import io from "socket.io-client";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  LocationOn,
  Flag,
  DirectionsCar,
  CheckCircle,
  Person,
} from "@mui/icons-material";
import { fetchPersistedUser } from "../../../utils/fetchLocalStorageData";
import { useSearchParams } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = "AIzaSyCUNJVymb9TyStgPqJSE5Ond4dZHn7fwZU";
const SOCKET_URL = "ws://localhost:5004";

const containerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const centerFallback = {
  lat: 6.9271,
  lng: 79.8612,
};

// Order status steps for the tracker
const statusSteps = [
  { label: "Order Placed", status: "placed" },
  { label: "Driver Assigned", status: "assigned" },
  { label: "In Transit", status: "started" },
  { label: "Delivered", status: "delivered" },
];

const OrderTrackingPage = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const user = fetchPersistedUser();
  console.log(user);

  const customerId = user._id;
  const orderId = searchParams.get("orderId");

  //?orderId=6817cdfba1c33f3329849d61

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const mockOrder = {
          orderId: orderId,
          delivery_status: "started",
          pickup_location: {
            lat: 6.9271,
            lng: 79.8612,
            address: "123 Pickup St, Colombo",
          },
          dropoff_location: {
            lat: 6.935,
            lng: 79.865,
            address: "456 Dropoff Ave, Colombo",
          },
          estimated_delivery_time: "2025-04-28T15:30:00Z",
          driver: {
            name: "John Doe",
            vehicle: "Toyota Prius",
            phone: "+94 123 456 789",
          },
        };
        setOrder(mockOrder);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Connected to socket server");
      socketRef.current.emit("register", {
        userId: customerId,
        orderId: order ? order.orderId : null,
      });
    });

    socketRef.current.on("driverLocationUpdate", ({ driverId, location }) => {
      console.log("📍 Received driver location:", location);
      if (location && mapRef.current) {
        setDriverLocation(location);
        mapRef.current.panTo(location);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("🚨 Socket connection error:", err);
      setError("Failed to connect to tracking server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Disconnected from socket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [order]);

  // Handle map load
  const onLoad = useCallback((map) => {
    console.log("🗺️ Map loaded");
    mapRef.current = map;
  }, []);

  // Get active step for status tracker
  const getActiveStep = () => {
    if (!order) return 0;
    const currentStatus = order.delivery_status;
    return statusSteps.findIndex((step) => step.status === currentStatus);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading Map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}

      {/* Main Content */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
            gap: 3,
          }}
        >
          {/* Sidebar: Order Details */}
          <Box sx={{ spaceY: 3 }}>
            {/* Order Summary */}
            {order && (
              <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Order #{order.orderId}
                    </Typography>
                    <Chip
                      label={order.delivery_status.toUpperCase()}
                      color={
                        order.delivery_status === "started"
                          ? "primary"
                          : "success"
                      }
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <LocationOn color="primary" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          Pickup Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.pickup_location.address ||
                            `${order.pickup_location.lat.toFixed(
                              4
                            )}, ${order.pickup_location.lng.toFixed(4)}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="flex-start">
                      <Flag color="secondary" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          Dropoff Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.dropoff_location.address ||
                            `${order.dropoff_location.lat.toFixed(
                              4
                            )}, ${order.dropoff_location.lng.toFixed(4)}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Estimated Delivery
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.estimated_delivery_time
                        ? new Date(
                            order.estimated_delivery_time
                          ).toLocaleTimeString()
                        : "Calculating..."}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Status Tracker */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Delivery Status
                </Typography>
                <Stepper activeStep={getActiveStep()} orientation="vertical">
                  {statusSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        icon={
                          index <= getActiveStep() ? (
                            <CheckCircle color="primary" />
                          ) : (
                            <DirectionsCar />
                          )
                        }
                      >
                        <Typography variant="subtitle2">
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Box>

          {/* Map Section */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 0, height: "100%" }}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={driverLocation || centerFallback}
                zoom={14}
                onLoad={onLoad}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {/* Driver Marker */}
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "#4285F4",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "white",
                    }}
                    label="🚗"
                  />
                )}
                {/* Pickup Marker */}
                {order?.pickup_location && (
                  <Marker
                    position={order.pickup_location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                    label="P"
                  />
                )}
                {/* Dropoff Marker */}
                {order?.dropoff_location && (
                  <Marker
                    position={order.dropoff_location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                    label="D"
                  />
                )}
              </GoogleMap>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderTrackingPage;
