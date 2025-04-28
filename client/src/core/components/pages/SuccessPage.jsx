import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const createOrder = async () => {
    const sessionId = searchParams.get("session_id"); // Stripe attaches session_id in success_url

    try {
      await axios.post("http://localhost:5003/api/orders", { sessionId });
      setLoading(false);
      setTimeout(() => {
        navigate("/order-confirmation"); // Go to order confirmation after delay
      }, 2000); // 2 seconds wait after successful order creation
    } catch (err) {
      console.error("Error creating order:", err);
      setLoading(false);
      setError(true);
      setTimeout(() => {
        navigate("/cart"); 
      }, 2000); // Redirect to cart to retry
    }
  };

  useEffect(() => {
    createOrder();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      {loading ? (
        <>
          <h1 className="text-4xl font-bold text-green-700 mb-4 animate-pulse">
            Processing your order...
          </h1>
          <p className="text-lg text-green-600">Please wait, this won't take long.</p>
        </>
      ) : error ? (
        <>
          <h1 className="text-4xl font-bold text-red-700 mb-4">
            Order Failed!
          </h1>
          <p className="text-lg text-red-600">Redirecting you to retry payment...</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-green-600">Redirecting to order confirmation...</p>
        </>
      )}
    </div>
  );
};

export default SuccessPage;
