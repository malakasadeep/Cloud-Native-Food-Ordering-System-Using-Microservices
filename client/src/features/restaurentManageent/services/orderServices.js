import { AxiosError } from "axios";
import client, { createServiceClient } from "../../../core/network/axiosClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";

const restaurantClient = createServiceClient("order");

const orderServices = {
  getAllOrderBelongsToResturent: async () => {
    try {
      const response = await restaurantClient.get(
        API_CONSTANTS.GET_ORDERS_BELONGS_TO_RESTURENT
      );

      console.log(response);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: "Failed to fetch categories",
      };
    }
  },
};

export default orderServices;
