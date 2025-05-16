import React, { useEffect, useState, useCallback } from "react";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";
import {
  FaChevronDown,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaBox,
  FaUser,
} from "react-icons/fa";

const Orders = ({ isSidebarCollapsed }) => {
  const [loading, setLoading] = useState(true);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    assigned: true,
    accepted: true,
    ongoing: true,
    delivered: false,
  });

  const riderId = "68079119955e8db805bf2471"; // TODO: Make dynamic

  const normalizeOrder = (order) => {
    let deliveryId = order.deliveryId;
    return {
      ...order,
      deliveryId:
        typeof deliveryId === "object" && deliveryId !== null
          ? {
              _id: deliveryId._id || "N/A",
              dropoff_location: deliveryId.dropoff_location || null,
              pickup_location: deliveryId.pickup_location || null,
              recipient_name: deliveryId.recipient_name || "Unknown",
              eta: deliveryId.eta || null,
            }
          : {
              _id: deliveryId || "N/A",
              dropoff_location: null,
              pickup_location: null,
              recipient_name: "Unknown",
              eta: null,
            },
    };
  };

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const assignedRes = await deliverService.getRiderAssignedOrders(riderId);
      setAssignedOrders((assignedRes.data || []).map(normalizeOrder));

      const acceptedRes = await deliverService.getRiderOrderByStatus(
        riderId,
        "accepted"
      );
      setAcceptedOrders((acceptedRes.data || []).map(normalizeOrder));

      const ongoingRes = await deliverService.getRiderOngoingDelivery(riderId);
      setOngoingOrders((ongoingRes.data || []).map(normalizeOrder));

      const deliveredRes = await deliverService.getRiderOrderByStatus(
        riderId,
        "delivered"
      );
      setDeliveredOrders((deliveredRes.data || []).map(normalizeOrder));
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

  const handleToggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAccept = async (orderId) => {
    try {
      await deliverService.riderAcceptOrder(riderId, orderId);
      await fetchAllOrders();
    } catch (err) {
      console.error("Error accepting order:", err);
      setError("Failed to accept order.");
    }
  };

  const handleStart = async (orderId) => {
    try {
      await deliverService.riderStartDelivery(orderId);
      await fetchAllOrders();
    } catch (err) {
      console.error("Error starting delivery:", err);
      setError("Failed to start delivery.");
    }
  };

  const statusColors = {
    assigned: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    ongoing: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
  };

  const OrderCard = ({ order, status }) => {
    const dropoff = order.deliveryId?.dropoff_location;
    const pickup = order.deliveryId?.pickup_location;
    const recipient = order.deliveryId?.recipient_name;
    const eta = order.deliveryId?.eta;

    return (
      <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FaBox /> Order ID: {order.deliveryId?._id || order._id}
          </h3>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <FaUser className="text-gray-400" /> <strong>Recipient:</strong>{" "}
            {recipient}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />{" "}
            <strong>Drop-off:</strong>{" "}
            {dropoff ? `${dropoff.lat}, ${dropoff.lng}` : "N/A"}
          </p>
          {pickup && (
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" />{" "}
              <strong>Pickup:</strong> {pickup.lat}, {pickup.lng}
            </p>
          )}
          {eta && (
            <p className="flex items-center gap-2">
              <FaClock className="text-blue-400" /> <strong>ETA:</strong> {eta}
            </p>
          )}
          <p>
            <strong>Status:</strong> {order.status || order.delivery_status}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        {status === "assigned" && (
          <button
            onClick={() => handleAccept(order.deliveryId._id)}
            className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow"
          >
            Accept Order
          </button>
        )}
        {status === "accepted" && (
          <button
            onClick={() => handleStart(order._id)}
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
          >
            Start Delivery
          </button>
        )}
      </div>
    );
  };

  const Section = ({ title, orders, sectionKey, status }) => (
    <section className="mb-8">
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
        onClick={() => handleToggleSection(sectionKey)}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          {title} <span className="text-gray-500">({orders.length})</span>
        </h2>
        {expandedSections[sectionKey] ? <FaChevronDown /> : <FaChevronRight />}
      </button>
      {expandedSections[sectionKey] && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-4 px-2">
          {orders.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">
              No orders found.
            </p>
          ) : (
            orders.map((order) => (
              <OrderCard key={order._id} order={order} status={status} />
            ))
          )}
        </div>
      )}
    </section>
  );

  return (
    <div
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? "ml-20" : "ml-64"
      } p-6 bg-gray-50 min-h-screen`}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📦 Orders Dashboard
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-60">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <Section
            title="Assigned Orders"
            orders={assignedOrders}
            sectionKey="assigned"
            status="assigned"
          />
          <Section
            title="Accepted Orders"
            orders={acceptedOrders}
            sectionKey="accepted"
            status="accepted"
          />
          <Section
            title="Ongoing Orders"
            orders={ongoingOrders}
            sectionKey="ongoing"
            status="ongoing"
          />
          <Section
            title="Delivered Orders"
            orders={deliveredOrders}
            sectionKey="delivered"
            status="delivered"
          />
        </>
      )}
    </div>
  );
};

export default Orders;
