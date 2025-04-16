import { AxiosError } from "axios";
import client from "../../../core/network/axiosClient";
import API_CONSTANTS from "../../../core/constants/apiConstents";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider, facebookProvider } from "../../firebase";

const customerService = {
  sendEmailOtp: async (email) => {
    try {
      const response = await client.post(API_CONSTANTS.SEND_EMAIL_OTP, { email });

      return {
        success: true,
        message: response.data.message || "Email sended successfully",
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error sending mail:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to send email",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error sending email:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error Sending email:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },
  sendSMSOtp: async (mobile) => {
    try {
      const response = await client.post(API_CONSTANTS.SEND_MOBILE_OTP, { mobile });

      return {
        success: true,
        message: response.data.message || "SMS sended successfully",
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Error sending SMS:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to send SMS",
          };
        }
      } else if (error instanceof Error) {
        console.error("Error sending SMS:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Error Sending SMS:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  VerifiEmailOtp: async ({email,otp}) => {
    try {
      const response = await client.post(API_CONSTANTS.VERIFY_EMAIL_OTP, {email,otp});

      return {
        success: true,
        message: "Verification successful",
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Verification error:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Verification failed",
          };
        }
      } else if (error instanceof Error) {
        console.error("Verification error:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Verification error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },
  VerifiSMSOtp: async ({mobile,otp}) => {
    try {
      const response = await client.post(API_CONSTANTS.VERIFY_MOBILE_OTP, {mobile,otp});

      return {
        success: true,
        message: "Verification successful",
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Verification error:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Verification failed",
          };
        }
      } else if (error instanceof Error) {
        console.error("Verification error:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Verification error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  logout: async () => {
    try {
      await client.get(API_CONSTANTS.LOGOUT);
      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await client.get(API_CONSTANTS.GET_CURRENT_USER);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  completeProfile: async (profileData) => {
    try {
      const response = await client.post(API_CONSTANTS.COMPLETE_PROFILE, profileData);
      
      return {
        success: true,
        message: response.data.message || "Profile updated successfully",
        user: response.data.user
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error("Profile update error:", error.response.data);
          return {
            success: false,
            message: error.response.data.message || "Failed to update profile",
          };
        }
      } else if (error instanceof Error) {
        console.error("Profile update error:", error.message);
        return {
          success: false,
          message: error.message,
        };
      }
      console.error("Profile update error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  },

  //   loginWithGoogle: async () => {
  //     try {
  //       const result = await signInWithPopup(auth, googleProvider);
  //       const user = result.user;

  //       const response = await client.post(API_CONSTANTS.SOCIAL_AUTH, {
  //         email: user.email,
  //         name: user.displayName,
  //         photo: user.photoURL,
  //       });

  //       if (response.data.token) {
  //         localStorage.setItem("token", response.data.token);
  //       }

  //       return {
  //         success: true,
  //         message: "Google login successful",
  //         token: response.data.token,
  //         user: response.data.user,
  //       };
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         if (error.response?.data) {
  //           console.error("Google login error:", error.response.data);
  //           return {
  //             success: false,
  //             message: error.response.data.message || "Google login failed",
  //           };
  //         }
  //       } else if (error instanceof Error) {
  //         console.error("Google login error:", error.message);
  //         return {
  //           success: false,
  //           message: error.message,
  //         };
  //       }
  //       console.error("Google login error:", error);
  //       return {
  //         success: false,
  //         message: "An unknown error occurred during Google login",
  //       };
  //     }
  //   },
};

export default customerService;
