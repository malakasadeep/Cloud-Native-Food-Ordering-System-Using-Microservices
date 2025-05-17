import React, { useEffect, useState } from "react";
import deliverService from "../../../features/partnersManagement/services/deliverServices";

const AdminOrderPage = () => {
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  useEffect(() => {
    fetchAllDeliveryOrders();
  }, []);

  const fetchAllDeliveryOrders = async () => {
    try {
      const response = await deliverService.getAllDeliveryLogs();
      setDeliveryOrders(response);
    } catch (error) {
      console.error(error);
    }
  };
  return <div>AdminOrderPage</div>;
};

export default AdminOrderPage;
