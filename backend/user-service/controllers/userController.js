import * as UserService from "../services/userServices.js";

export const register = async (req, res) => {
  try {
    const provider = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: provider,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to register user",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await UserService.login(email, password);

    // Set the token as an HTTP-only cookie
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Return user info without the token in the response body
    res.status(200).json({
      success: true,
      data: { user: result.user },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);

    // Provide specific status codes based on error types
    let statusCode = 401; // Default to unauthorized

    if (err.message.includes("pending approval")) {
      statusCode = 403; // Forbidden - account pending
    } else if (err.message.includes("rejected")) {
      statusCode = 403; // Forbidden - account rejected
    }

    res.status(statusCode).json({
      success: false,
      message: err.message || "Authentication failed",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const providers = await UserService.viewAll();
    res.status(200).json({
      success: true,
      data: providers,
      count: providers.length,
    });
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const provider = await UserService.viewById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);

    // Check if error is due to invalid ObjectId
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await UserService.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required",
      });
    }

    const updated = await UserService.updateStatus(
      req.params.id,
      status,
      reason
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: `User status updated to ${status} successfully`,
    });
  } catch (err) {
    console.error("Error updating user status:", err);

    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  await UserService.deleteProvider(req.params.id);
  res.json({ message: "Deleted successfully" });
};

export const update = async (req, res) => {
  try {
    const updated = await UserService.updateDetails(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: "User details updated successfully",
    });
  } catch (err) {
    console.error("Error updating user details:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user details",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const getByRole = async (req, res) => {
  const users = await UserService.getUserByRole(req.params.role);
  res.json(users);
};
