import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import orderService from "../../../features/restaurentManageent/services/orderservice";
import Lottie from "lottie-react";
import { Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import placedAnimation from "../../../assets/lottie/placed.json";
import processingAnimation from "../../../assets/lottie/processingg.json";
import completedAnimation from "../../../assets/lottie/completed.json";
import cancelledAnimation from "../../../assets/lottie/cancelled.json";

const steps = [
  {
    label: "Order Placed",
    status: "PLACED",
    animation: placedAnimation,
    message: "Payment Successful!\nYour order has been received!",
  },
  {
    label: "Processing",
    status: "PROCESSING",
    animation: processingAnimation,
    message: "Your order is being prepared!",
  },
  {
    label: "Completed",
    status: "COMPLETED",
    animation: completedAnimation,
    message: "Your order is ready to be delivered!",
  },
];

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleTrackOrder = () => {
    const orderId = "6817cdfba1c33f3329849d61";
    navigate(`/customer/track-order/?orderId=${orderId}`);
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.success) {
          setOrder(res.data);
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

  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Loading order...</p>;

  const currentIndex = steps.findIndex(
    (step) => step.status === order.orderStatus
  );

  const OrderDetails = () => (
    <>
      <p className="text-gray-700 text-left">
        <strong>Order ID:</strong> {order._id}
      </p>
      <p className="text-gray-700 text-left">
        <strong>Amount:</strong> RS {order.totalAmount}
      </p>
      <p className="text-gray-700 text-left">
        <strong>Delivery Address:</strong> {order.deliveryAddress}
      </p>
      <p className="text-gray-700 text-left">
        <strong>Items:</strong>
      </p>
      <ul className="text-gray-700 text-left list-disc ml-6">
        {order.items.map((item, index) => (
          <li key={index}>
            {item.itemName} x {item.qty} — RS {item.unitPrice}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">
      <motion.div
        className="flex flex-col items-center p-6 rounded-2xl shadow-2xl w-full max-w-2xl bg-white/30 backdrop-blur-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Order Progress
        </h2>

        {order.orderStatus === "CANCELLED" ? (
          <>
            <Lottie
              animationData={cancelledAnimation}
              className="w-60 h-60 mb-4"
              loop
            />
            <h2 className="text-2xl font-semibold text-red-500 mb-4">
              This order has been cancelled
            </h2>
            <OrderDetails />
          </>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative flex justify-between items-center w-full mb-8 px-2">
              {steps.map((_, index) => {
                if (index === steps.length - 1) return null;
                const isActive = index < currentIndex;
                return (
                  <div
                    key={index}
                    className="absolute top-5 h-1 z-0"
                    style={{
                      left: `${(index / (steps.length - 1)) * 100}%`,
                      width: `${100 / (steps.length - 1)}%`,
                      backgroundColor: isActive ? "#22c55e" : "#d1d5db",
                    }}
                  />
                );
              })}

              {steps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={step.status}
                    className="flex flex-col items-center relative z-20 w-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div
                      className={`rounded-full flex items-center justify-center mb-2 
                        ${
                          isCurrent
                            ? "w-12 h-12 text-lg bg-gradient-to-r from-green-400 to-green-600 text-white"
                            : isCompleted
                            ? "w-10 h-10 bg-green-500 text-white"
                            : "w-10 h-10 bg-gray-300 text-gray-600"
                        }`}
                    >
                      {isCompleted || isCurrent ? (
                        <Check size={isCurrent ? 24 : 20} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium text-center 
                        ${
                          isCurrent
                            ? "text-green-700 font-semibold"
                            : isCompleted
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Animation and Message */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Lottie
                animationData={steps[currentIndex]?.animation}
                className="w-60 h-60 mx-auto mb-4"
                loop
              />
              <p className="text-xl font-semibold text-green-600 mb-4">
                {steps[currentIndex]?.message.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              <OrderDetails />
              <div className="flex gap-8">
                <button
                  onClick={handleTrackOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Track Order
                </button>

                <button
                  onClick={() => navigate(`/customer/profile`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Go To Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
