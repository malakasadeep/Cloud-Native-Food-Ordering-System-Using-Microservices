import React, { useEffect, useState } from "react";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState();
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRiderAssignedOrders();
    fetchRiderAcceptedOrders();
  }, []);

  const fetchRiderAssignedOrders = async () => {
    setLoading(true);
    try {
      const res = await deliverService.getRiderAssignedOrders(
        "68079119955e8db805bf2471"
      );
      console.log(res);
      if (res.success) {
        setAssignedOrders(res.data || []);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderAcceptedOrders = async () => {
    try {
      const response = await deliverService.getRiderOrderByStatus(
        "68079119955e8db805bf2471",
        "accepted"
      );

      setAcceptedOrders(response.data);
    } catch (error) {}
  };

  const handleAccept = async (orderId) => {
    try {
      await deliverService.riderAcceptOrder(
        "68079119955e8db805bf2471",
        orderId
      );
      await fetchRiderAssignedOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStart = async (orderId) => {
    try {
      await deliverService.riderStartDelivery(orderId);
      await fetchRiderAssignedOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Assigned Orders Section */}
      <div className="mb-8">
        <Typography variant="h5" className="mb-4">
          Assigned Orders
        </Typography>
        {assignedOrders.length > 0 ? (
          assignedOrders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardContent>
                <Typography variant="h6">{order.customerName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.deliveryAddress}
                </Typography>
                <Divider className="my-2" />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAccept(order._id)}
                >
                  Accept Order
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No assigned orders available.</Typography>
        )}
      </div>

      {/* Accepted Orders Section */}
      <div>
        <Typography variant="h5" className="mb-4">
          Accepted Orders
        </Typography>
        {acceptedOrders.length > 0 ? (
          acceptedOrders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardContent>
                <Typography variant="h6">{order.customerName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.deliveryAddress}
                </Typography>
                <Divider className="my-2" />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleStart(order._id)}
                >
                  Start Delivery
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No accepted orders available.</Typography>
        )}
      </div>
    </div>
  );
};

export default Orders;
