import { AxiosError } from "axios";
import client, { createServiceClient } from "../../../core/network/axiosClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";

const restaurantClient = createServiceClient('restaurant');

const menuService = {
  createCategory: async (categoryData) => {
    try {
      const response = await restaurantClient.post(API_CONSTANTS.CREATE_CATEGORY, categoryData);

      return {
        success: true,
        message: response.data.message || "Category created successfully",
        data: response.data.data
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error creating category:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to create category",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error creating category:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error creating category:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  getAllCategories: async () => {
    try {
      const response = await restaurantClient.get(API_CONSTANTS.GET_CATEGORIES);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: "Failed to fetch categories",
      };
    }
  }
};

export default menuService;
