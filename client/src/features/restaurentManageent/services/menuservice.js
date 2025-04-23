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
  },

  getCategoryByRestaurantId: async (restaurantId) => {
    try {
      const response = await restaurantClient.get(`${API_CONSTANTS.GET_CATEGORIES}/${restaurantId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error fetching categories for restaurant ${restaurantId}:`, error);
      return {
        success: false,
        message: "Failed to fetch restaurant categories",
      };
    }
  },

  addMenu: async (menuData) => {
    try {
      const response = await restaurantClient.post(API_CONSTANTS.CREATE_MENU, menuData);

      return {
        success: true,
        message: response.data.message || "Menu item created successfully",
        data: response.data.data
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error creating menu item:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to create menu item",
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

  getAllMenus: async () => {
    try {
      const response = await restaurantClient.get(API_CONSTANTS.GET_MENUS);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching menus:", error);
      return {
        success: false,
        message: "Failed to fetch menus",
      };
    }
  },

  getMenuByRestaurantId: async (restaurantId) => {
    try {
      const response = await restaurantClient.get(`${API_CONSTANTS.GET_MENU_BY_RESTAURANT_ID}/${restaurantId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error fetching menus for restaurant ${restaurantId}:`, error);
      return {
        success: false,
        message: "Failed to fetch restaurant menus",
      };
    }
  }
};

export default menuService;
