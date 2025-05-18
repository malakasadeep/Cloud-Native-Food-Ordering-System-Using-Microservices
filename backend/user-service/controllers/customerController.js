import * as authService from "../services/customerServices.js";
import Customer from "../models/customerModel.js";

export const sendMobileOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile number is required" });
    }

    const otp = await authService.loginWithMobile(mobile);
    res.json({ success: true, message: "OTP sent", otp });
  } catch (error) {
    console.error("Error in sendMobileOTP:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Failed to send OTP" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyMobileOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    await authService.verifyMobileOTP(mobile, otp, res);
    // No need for additional response as it's handled in the service
  } catch (error) {
    console.error("Error in verifyMobileOTP:", error);
    const statusCode = error.message === "Invalid OTP" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const otp = await authService.loginWithEmail(email);
    res.json({ success: true, message: "OTP sent", otp });
  } catch (error) {
    console.error("Error in sendEmailOTP:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Failed to send OTP" });
  }
};

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    await authService.verifyEmailOTP(email, otp, res);
    // No need for additional response as it's handled in the service
  } catch (error) {
    console.error("Error in verifyEmailOTP:", error);
    const statusCode = error.message === "Invalid OTP" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const result = await authService.googleLogin(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error in googleLogin:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};

export const completeProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await authService.completeProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in completeProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    await authService.verifyMobileOTP(mobile, otp, res);
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    const statusCode = error.message === "Invalid OTP" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    console.error("Error in signOut:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Sign out failed" });
  }
};
