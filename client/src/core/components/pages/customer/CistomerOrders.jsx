import React, { useEffect, useState } from "react";
import deliverService from "../../../../features/partnersManagement/services/deliverServices";
import { fetchPersistedUser } from "../../../utils/fetchLocalStorageData";

const CustomerOrders = () => {
  const [customerOrders, setCustomerOrders] = useState([]);

  const user = fetchPersistedUser();
  console.log(user);

  const customerId = user?._id;
  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await deliverService.getCustomerOrders(customerId);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return <div>Orders</div>;
};

export default CustomerOrders;
