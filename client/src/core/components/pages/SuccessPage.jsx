import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createServiceClient } from "../../network/axiosClient";
import API_CONSTANTS from "../../constants/apiConstents";

const orderClient = createServiceClient('order');

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const calledRef = useRef(false);

  const createOrder = async () => {
    const sessionId = searchParams.get("session_id");

    try {
      const res = await orderClient.post(API_CONSTANTS.CREATE_ORDER, {
        sessionId,});
      // const res = await axios.post(
      //   "http://localhost:5003/api/v1/orders/create-order",
      //   {
      //     sessionId,
      //   }
      // );

      const orderId = res.data?.order?._id;

      // After 2 seconds, show the success message
      setTimeout(() => {
        setShowSuccess(true);
      }, 1000);
      setTimeout(() => {
        navigate(`/customer/order/confirmation?orderId=${orderId}`);
      }, 4000);
    } catch (err) {
      console.error("Error creating order:", err);
      setError(true);
      setTimeout(() => {
        navigate("/cart");
      }, 2000);
    }
  };

  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      createOrder();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      {error ? (
        <>
          <h1 className="text-4xl font-bold text-red-700 mb-4">
            Order Failed!
          </h1>
          <p className="text-lg text-red-600">
            Redirecting you to retry payment...
          </p>
        </>
      ) : showSuccess ? (
        <>
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-green-600">
            Thank you for your order. We are preparing it for delivery!
          </p>
          <button
            onClick={() => navigate(`/customer/order/track`)}
            className="px-6 py-2 mt-8 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Track Your Order
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-green-700 mb-4 animate-pulse">
            Processing your order...
          </h1>
          <p className="text-lg text-green-600">
            Please wait, this won't take long.
          </p>
        </>
      )}
    </div>
  );
};

export default SuccessPage;
