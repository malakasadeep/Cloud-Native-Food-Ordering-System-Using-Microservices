import React, { useEffect, useState } from "react";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRiderAssignedOrders();
  }, []);

  const fetchRiderAssignedOrders = async () => {
    try {
      const res = await deliverService.getRiderAssignedOrders(
        "68079119955e8db805bf2471"
      );
      console.log(res);
      if (res.success) {
        setOrders(res.data || []);
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Assigned Orders
        </h1>

        {orders.length === 0 ? (
          <Typography variant="body1" className="text-gray-600">
            No assigned orders found.
          </Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <Card
                key={index}
                className="shadow-md hover:shadow-lg transition duration-300"
              >
                <CardContent>
                  <Typography variant="h6" className="mb-2 text-blue-600">
                    Order ID: {order.orderId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pickup: {order.pickup_location?.address || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Drop-off: {order.dropoff_location?.address || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status:{" "}
                    <span className="font-semibold">
                      {order.delivery_status}
                    </span>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
