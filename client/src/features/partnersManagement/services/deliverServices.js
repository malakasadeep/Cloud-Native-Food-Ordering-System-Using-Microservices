import { AxiosError } from "axios";
import client, { createServiceClient } from "../../../core/network/axiosClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";

// Create a client specifically for user service
const deliverClient = createServiceClient("deliver");

const deliverService = {
  getRiderAssignedOrders: async (riderId) => {
    try {
      const response = await deliverClient.get(
        `${API_CONSTANTS.GET_RIDER_ASSIGNED_ORDERS}${riderId}`
      );

      return {
        success: true,
        message: response.data.message || "Account created successfully",
        data: response.data.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error creating account:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to create account",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error creating account:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error creating account:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },
};

export default deliverService;
