// import orderClient from "../api/orderClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";
import axios, { AxiosError } from "axios";
import client, { createServiceClient } from "../../../core/network/axiosClient";

const orderClient = createServiceClient("order");

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await orderClient.get(API_CONSTANTS.GET_ORDERS);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        success: false,
        message: "Failed to fetch orders",
      };
    }
  },

  createCheckoutSession: async (cartItems, address) => {
    try {
      const response = await orderClient.post(
        API_CONSTANTS.POST_CREATE_SESSION,
        { cartItems, deliveryAddress: address || "No address found" }
      );

      return {
        success: true,
        message: response.data.message || "Session creation successfully",
        data: response.data.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error creating menu item:", error.response.data);
          return {
            success: false,
            message:
              error.response.data.message || "Failed to create menu item",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error creating menu item:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error creating menu item:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await orderClient.post(
        `${API_CONSTANTS.UPDATE_ORDER_STATUS}/${orderId}`,
        { newStatus }
      );
      return {
        success: true,
        message: response.data.message,
        data: response.data.order,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to update order status",
      };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await orderClient.get(`${API_CONSTANTS.GET_ORDER_BY_ID}/${orderId}`);
      //const response = await axios.get(`http://localhost:5003/api/v1/orders/${orderId}`);
      return {
        success: true,
        data: response.data.order,
      };
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to fetch order details",
      };
    }
  },
};

export default orderService;
