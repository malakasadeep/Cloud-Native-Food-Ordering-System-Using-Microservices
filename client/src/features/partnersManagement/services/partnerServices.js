import { AxiosError } from "axios";
import client, { createServiceClient } from "../../../core/network/axiosClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";

// Create a client specifically for user service
const userClient = createServiceClient("user");
const partnerService = {
  register: async (userData) => {
    try {
      const response = await userClient.post(API_CONSTANTS.REGISTER, userData);

      return {
        success: true,
        message: response.data.message || "Account created successfully",
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

  login: async (credentials) => {
    try {
      const response = await userClient.post(API_CONSTANTS.LOGIN, credentials);
      return {
        success: true,
        message: "Login successful",
        user: response.data.data.user,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Login error:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Login failed",
          };
        }
      } else if (error instanceof Error) {
        console.error("Login error:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Login error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  getAllPartners: async () => {
    try {
      const response = await userClient.get(API_CONSTANTS.GET_ALL);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching all partners:", error);
      return {
        success: false,
        message: "Failed to fetch partners",
      };
    }
  },

  getPendingPartners: async () => {
    try {
      const response = await userClient.get(API_CONSTANTS.GET_ALL);
      const pendingPartners = response.data.data.filter(
        (partner) =>
          partner.status && partner.status.toLowerCase() === "pending"
      );

      return {
        success: true,
        data: pendingPartners,
      };
    } catch (error) {
      console.error("Error fetching pending partners:", error);
      return {
        success: false,
        message: "Failed to fetch pending partners",
      };
    }
  },

  updatePartnerStatus: async (partnerId, status, reason = null) => {
    try {
      const requestBody = { status };

      if (reason) {
        requestBody.reason = reason;
      }

      const response = await userClient.patch(
        `${API_CONSTANTS.GET_ALL}/${partnerId}/status`,
        requestBody
      );

      return {
        success: true,
        message: `Partner successfully ${status}`,
        data: response.data.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error(`Error updating partner status:`, error.response.data);
          return {
            success: false,
            message:
              error.response.data.message || `Failed to update partner status`,
          };
        }
      } else if (error instanceof Error) {
        console.error(`Error updating partner status:`, error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error(`Error updating partner status:`, error);
      return {
        success: false,
        message: "An unknown error occurred while updating partner status",
      };
    }
  },

  logout: async () => {
    try {
      await userClient.get(API_CONSTANTS.LOGOUT);
      localStorage.removeItem("token");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");

      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  },
   getRestaurantById: async (restaurantId) => {
    try {
      const response = await userClient.get(`${API_CONSTANTS.GET_RESTAURANT}/${restaurantId}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error(`Error fetching restaurant ${restaurantId}:`, error);
      return {
        success: false,
        message: "Failed to fetch restaurant details",
      };
    }
  },

  updateRestaurentAvailability: async (Id, availabilityStatus) => {
    try {
      const response = await userClient.patch(
        `${API_CONSTANTS.UPDATE_REST_AVAILABILITY}/${Id}/availability`,
        { isAvailable : availabilityStatus }
      );

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          message: response.data.message || "Menu availability updated successfully",
          data: response.data.data || null,
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Failed to update menu availability",
        };
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        console.error(`Error updating menu availability for ${menuId}:`, error.response.data);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update menu availability",
        };
      }

      console.error(`Error updating menu availability for ${menuId}:`, error);
      return {
        success: false,
        message: error.message || "An unknown error occurred",
      };
    }
  },

  getAllRestaurants: async () => {
    try {
      const response = await userClient.get(API_CONSTANTS.GET_ALL_RESTAURANTS);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error fetching all restaurants:", error);
      return {
        success: false,
        message: "Failed to fetch restaurants",
      };
    }
  },

  getAllRiders: async () => {
    try {
      const response = await userClient.get(API_CONSTANTS.GET_ALL_RIDERS);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error fetching all riders:", error);
      return {
        success: false,
        message: "Failed to fetch riders",
      };
    }
  },
};

export default partnerService;
