import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import orderService from "../../../features/restaurentManageent/services/orderservice";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.success) {
          setOrder(res.data); // directly using data if it is the order object
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Failed to fetch order details");
      }
    };

    fetchOrder();

    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!order) return <p>Loading order...</p>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {order._id}</p>
      <p>Status: <strong>{order.orderStatus}</strong></p>
      <p>Amount: ${order.totalAmount}</p>
      <p>Delivery Address: {order.deliveryAddress}</p>
    </div>
  );
};

export default OrderConfirmation;
