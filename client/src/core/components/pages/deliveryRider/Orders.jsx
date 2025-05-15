import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  IconButton,
  Collapse,
  Tabs,
  Tab,
  Badge,
  Skeleton,
} from "@mui/material";
import {
  Refresh,
  ExpandMore,
  ExpandLess,
  LocalShipping,
  CheckCircle,
  Directions,
} from "@mui/icons-material";
import { fetchUser } from "../../../utils/fetchLocalStorageData";

const Orders = ({ isSidebarCollapsed }) => {
  const [loading, setLoading] = useState(true);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    assigned: true,
    accepted: true,
    ongoing: true,
    delivered: false,
  });

  const riderId = "68079119955e8db805bf2471"; // TODO: Make dynamic

  // Fetch all orders
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch Assigned Orders
      const assignedRes = await deliverService.getRiderAssignedOrders(riderId);
      if (assignedRes.success) {
        setAssignedOrders(assignedRes.data || []);
      } else {
        setError(assignedRes.message || "Failed to load assigned orders.");
      }

      // Fetch Accepted Orders
      const acceptedRes = await deliverService.getRiderOrderByStatus(
        riderId,
        "accepted"
      );
      setAcceptedOrders(acceptedRes.data || []);

      // Fetch Ongoing Order
      const ongoingRes = await deliverService.getRiderOngoingDelivery(riderId);
      if (ongoingRes.success && ongoingRes.data.length > 0) {
        setOngoingOrder(ongoingRes.data[0]);
      } else {
        setOngoingOrder(null);
      }

      // Fetch Delivered Orders (mocked API call)
      const deliveredRes = await deliverService.getRiderOrderByStatus(
        riderId,
        "delivered"
      );
      setDeliveredOrders(deliveredRes.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Handle Accept Order
  const handleAccept = async (orderId) => {
    try {
      await deliverService.riderAcceptOrder(riderId, orderId);
      await fetchAllOrders();
    } catch (err) {
      console.error("Error accepting order:", err);
      setError("Failed to accept order.");
    }
  };

  // Handle Start Delivery
  const handleStart = async (orderId) => {
    try {
      await deliverService.riderStartDelivery(orderId);
      await fetchAllOrders();
    } catch (err) {
      console.error("Error starting delivery:", err);
      setError("Failed to start delivery.");
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Render order card
  const renderOrderCard = (order, type) => (
    <Card
      key={order._id}
      sx={{
        mb: 2,
        boxShadow: 3,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight="bold">
            Order #{order.deliveryId}
          </Typography>
          <Chip
            label={order?.status}
            color={
              order.status === "assigned"
                ? "warning"
                : order.status === "accepted"
                ? "primary"
                : "success"
            }
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <strong>Customer:</strong> {order.customerName || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <strong>Address:</strong> {order.deliveryAddress || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <strong>Distance:</strong>{" "}
          {order.distance ? `${order.distance} km` : "Calculating..."}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <strong>Estimated Delivery:</strong>{" "}
          {order.estimated_delivery_time
            ? new Date(order.estimated_delivery_time).toLocaleString()
            : "N/A"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" gap={1}>
          {type === "assigned" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              onClick={() => handleAccept(order.deliveryId)}
            >
              Accept
            </Button>
          )}
          {type === "accepted" && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Directions />}
              onClick={() => handleStart(order._id)}
            >
              Start Delivery
            </Button>
          )}
          {type === "ongoing" && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/delivery/orders/start`}
              startIcon={<LocalShipping />}
            >
              View Map
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  // Render section
  const renderSection = (title, orders, type, badgeCount) => (
    <Box mb={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          <Badge badgeContent={badgeCount} color="primary" sx={{ mr: 2 }}>
            {title}
          </Badge>
        </Typography>
        <IconButton onClick={() => toggleSection(type)}>
          {expandedSections[type] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={expandedSections[type]}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
          </>
        ) : orders.length > 0 ? (
          orders.map((order) => renderOrderCard(order, type))
        ) : (
          <Typography color="text.secondary">
            No {title.toLowerCase()} available.
          </Typography>
        )}
      </Collapse>
    </Box>
  );

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="grey.100"
      >
        <Typography variant="h6" color="error" mb={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchAllOrders}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <main
        style={{
          marginLeft: isSidebarCollapsed ? "60px" : "220px",
          transition: "margin-left 0.3s",
        }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen rounded-2xl"
      >
        <div className="px-20 py-6">
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 3,
              boxShadow: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Rider Dashboard
              </Typography>
              <Typography variant="body1">Manage your deliveries</Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Refresh />}
              onClick={fetchAllOrders}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {/* Main Content */}
          <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{ mb: 4, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}
            >
              <Tab label="All Orders" />
              <Tab label="Assigned" />
              <Tab label="Accepted" />
              <Tab label="Ongoing" />
              <Tab label="Delivered" />
            </Tabs>

            {/* Content */}
            {tabValue === 0 && (
              <>
                {renderSection(
                  "Ongoing Order",
                  ongoingOrder ? [ongoingOrder] : [],
                  "ongoing",
                  ongoingOrder ? 1 : 0
                )}
                {renderSection(
                  "Assigned Orders",
                  assignedOrders,
                  "assigned",
                  assignedOrders.length
                )}
                {renderSection(
                  "Accepted Orders",
                  acceptedOrders,
                  "accepted",
                  acceptedOrders.length
                )}
                {renderSection(
                  "Delivered Orders",
                  deliveredOrders,
                  "delivered",
                  deliveredOrders.length
                )}
              </>
            )}
            {tabValue === 1 &&
              renderSection(
                "Assigned Orders",
                assignedOrders,
                "assigned",
                assignedOrders.length
              )}
            {tabValue === 2 &&
              renderSection(
                "Accepted Orders",
                acceptedOrders,
                "accepted",
                acceptedOrders.length
              )}
            {tabValue === 3 &&
              renderSection(
                "Ongoing Order",
                ongoingOrder ? [ongoingOrder] : [],
                "ongoing",
                ongoingOrder ? 1 : 0
              )}
            {tabValue === 4 &&
              renderSection(
                "Delivered Orders",
                deliveredOrders,
                "delivered",
                deliveredOrders.length
              )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              bgcolor: "grey.200",
              p: 2,
              textAlign: "center",
              mt: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Powered by DeliveryPro | <a href="/support">Support</a>
            </Typography>
          </Box>
        </div>
      </main>
    </div>
  );
};

export default Orders;
