import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import {
  DirectionsCar,
  LocationOn,
  Flag,
  PersonPin,
  Schedule,
  LocalShipping,
  CheckCircle,
} from "@mui/icons-material";
import io from "socket.io-client";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";

// Libraries for Google Maps
const libraries = ["places", "directions"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

// Debounce function to limit frequent updates
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const SOCKET_SERVER_URL = "ws://localhost:5004";

const OrderStartPage = ({ isSidebarCollapsed }) => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [driverLocation, setDriverLocation] = useState({
    lat: 7.2374,
    lng: 79.8612,
  });
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCUNJVymb9TyStgPqJSE5Ond4dZHn7fwZU",
    libraries,
  });

  const driverId = "68079119955e8db805bf2471";

  // Format distance and duration
  const formatDistance = (meters) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  // Get directions with waypoints
  const getDirections = useCallback((orderData, location) => {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: new window.google.maps.LatLng(location.lat, location.lng),
      destination: new window.google.maps.LatLng(
        orderData.dropoff_location.lat,
        orderData.dropoff_location.lng
      ),
      waypoints: [
        {
          location: new window.google.maps.LatLng(
            orderData.pickup_location.lat,
            orderData.pickup_location.lng
          ),
          stopover: true,
        },
      ],
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        setDirections(result);
        if (result.routes[0] && result.routes[0].legs) {
          const totalDistance = result.routes[0].legs.reduce(
            (sum, leg) => sum + (leg.distance?.value || 0),
            0
          );
          const totalDuration = result.routes[0].legs.reduce(
            (sum, leg) => sum + (leg.duration?.value || 0),
            0
          );

          setRouteInfo({
            distance: totalDistance,
            duration: totalDuration,
          });
        }
      } else {
        console.error("Directions request failed:", status);
      }
    });
  }, []);

  // Fetch ongoing order
  useEffect(() => {
    const fetchOngoingOrder = async () => {
      setLoading(true);
      try {
        const res = await deliverService.getRiderOngoingDelivery(driverId);
        if (res.success && res.data.length > 0) {
          setOrder(res.data[0]);
        } else {
          setError(res.message || "No ongoing deliveries found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ongoing order");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingOrder();
  }, []);

  // Initialize Socket.IO connection and register driver
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle connection
    socketRef.current.on("connect", () => {
      console.log("🟢 Connected to Socket.IO server");

      socketRef.current.emit("register", { userId: driverId });
    });

    // Handle connection errors
    socketRef.current.on("connect_error", (err) => {
      console.error("🚨 Socket.IO connection error:", err);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
      console.log("🔌 Disconnected from Socket.IO server");
    };
  }, []);

  // Track driver location and emit to Socket.IO server
  useEffect(() => {
    if (!navigator.geolocation) return;

    const updateDriverLocation = debounce((coords) => {
      setDriverLocation(coords);
      if (order && mapRef.current) {
        mapRef.current.panTo(coords);
        getDirections(order, coords);
      }
      // Emit location to Socket.IO server
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("driverLocation", {
          driverId,
          location: coords,
        });
        console.log(`📍 Emitted driver location:`, coords);
      }
    }, 1000);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        updateDriverLocation(coords);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [order, getDirections]);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-4 text-center">
          <LocalShipping fontSize="large" color="primary" />
          <Typography variant="h6" className="mt-2">
            No active deliveries
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mt-1">
            You currently don't have any ongoing deliveries
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <main
        style={{
          marginLeft: isSidebarCollapsed ? "60px" : "220px",
          transition: "margin-left 0.3s",
        }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen rounded-2xl"
      >
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <Typography variant="h4" className="font-bold text-gray-800">
                  Delivery Dashboard
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Real-time tracking and order details
                </Typography>
              </div>
              <Chip
                label={order.delivery_status.toUpperCase()}
                color={
                  order.delivery_status === "started" ? "primary" : "secondary"
                }
                className="mt-2 md:mt-0"
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Order Details */}
              <div className="space-y-4">
                {/* Order Summary Card */}
                <Card className="shadow-sm">
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <Typography variant="h6" className="font-semibold">
                        Order #{order.orderId}
                      </Typography>
                      <Avatar className="bg-blue-100 text-blue-600">
                        {order.customerId?.charAt(0) || "C"}
                      </Avatar>
                    </div>

                    <Divider className="my-2" />

                    {/* Route Summary */}
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <LocationOn color="primary" className="mr-2 mt-0.5" />
                        <div>
                          <Typography variant="subtitle2">
                            Pickup Location
                          </Typography>
                          <Typography>
                            {order.pickup_location.address ||
                              `${order.pickup_location.lat.toFixed(
                                4
                              )}, ${order.pickup_location.lng.toFixed(4)}`}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Flag color="secondary" className="mr-2 mt-0.5" />
                        <div>
                          <Typography variant="subtitle2">
                            Dropoff Location
                          </Typography>
                          <Typography>
                            {order.dropoff_location.address ||
                              `${order.dropoff_location.lat.toFixed(
                                4
                              )}, ${order.dropoff_location.lng.toFixed(4)}`}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <Divider className="my-3" />

                    {/* Route Stats */}
                    {routeInfo && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DirectionsCar color="action" className="mr-2" />
                            <Typography variant="subtitle2">
                              Distance
                            </Typography>
                          </div>
                          <Typography>
                            {formatDistance(routeInfo.distance)}
                          </Typography>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Schedule color="action" className="mr-2" />
                            <Typography variant="subtitle2">
                              Est. Time
                            </Typography>
                          </div>
                          <Typography>
                            {formatDuration(routeInfo.duration)}
                          </Typography>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      className="mt-4"
                      startIcon={<CheckCircle />}
                      color="primary"
                    >
                      Mark as Delivered
                    </Button>
                  </CardContent>
                </Card>

                {/* Driver Card */}
                <Card className="shadow-sm">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      className="font-semibold mb-3"
                    >
                      Your Location
                    </Typography>
                    <div className="flex items-center">
                      <PersonPin color="primary" className="mr-2" />
                      <Typography>
                        {driverLocation.lat.toFixed(4)},{" "}
                        {driverLocation.lng.toFixed(4)}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map Section */}
              <div className="lg:col-span-2">
                <div className="h-full min-h-[500px]">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={driverLocation}
                    zoom={14}
                    options={{
                      streetViewControl: true,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                    onLoad={onMapLoad}
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
                      />
                    )}

                    {/* Pickup Marker */}
                    {order && (
                      <Marker
                        position={order.pickup_location}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                      />
                    )}

                    {/* Dropoff Marker */}
                    {order && (
                      <Marker
                        position={order.dropoff_location}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        }}
                      />
                    )}

                    {/* Route */}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          polylineOptions: {
                            strokeColor: "#1a73e8",
                            strokeWeight: 5,
                            strokeOpacity: 0.8,
                          },
                          markerOptions: {
                            visible: false,
                          },
                          suppressMarkers: true,
                        }}
                      />
                    )}
                  </GoogleMap>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderStartPage;
