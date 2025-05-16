import * as UserService from '../services/userServices.js';

export const register = async (req, res) => {
  try {
    const provider = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: provider,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const result = await UserService.login(email, password);
    
    // Set the token as an HTTP-only cookie
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
    
    // Return user info without the token in the response body
    res.status(200).json({
      success: true,
      data: { user: result.user },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    
    // Provide specific status codes based on error types
    let statusCode = 401; // Default to unauthorized
    
    if (err.message.includes('pending approval')) {
      statusCode = 403; // Forbidden - account pending
    } else if (err.message.includes('rejected')) {
      statusCode = 403; // Forbidden - account rejected
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: err.message || 'Authentication failed'
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const providers = await UserService.viewAll();
    res.status(200).json({
      success: true,
      data: providers,
      count: providers.length
    });
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getById = async (req, res) => {
  try {
    const provider = await UserService.viewById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    
    // Check if error is due to invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await UserService.deleteUser(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required'
      });
    }
    
    const updated = await UserService.updateStatus(req.params.id, status, reason);
    
    res.status(200).json({
      success: true,
      data: updated,
      message: `User status updated to ${status} successfully`
    });
  } catch (err) {
    console.error('Error updating user status:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await UserService.updateDetails(req.params.id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updated,
      message: 'User details updated successfully'
    });
  } catch (err) {
    console.error('Error updating user details:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update user details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await UserService.getRestaurantById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (err) {
    console.error('Error fetching restaurant by ID:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.name === 'CastError' || err.message.includes('Invalid ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getRiderById = async (req, res) => {
  try {
    const rider = await UserService.getRiderById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: rider
    });
  } catch (err) {
    console.error('Error fetching rider by ID:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.name === 'CastError' || err.message.includes('Invalid ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rider ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rider',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateRestaurantAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    if (isAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isAvailable field is required'
      });
    }
    
    // Convert to boolean if needed
    const availabilityStatus = Boolean(isAvailable);
    
    const updatedRestaurant = await UserService.changeRestaurantAvailability(
      req.params.id, 
      availabilityStatus
    );
    
    res.status(200).json({
      success: true,
      data: updatedRestaurant,
      message: `Restaurant availability has been ${availabilityStatus ? 'enabled' : 'disabled'}`
    });
  } catch (err) {
    console.error('Error updating restaurant availability:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.name === 'CastError' || err.message.includes('Invalid ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update restaurant availability',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateRiderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const updatedRider = await UserService.updateRiderLocation(
      req.params.id, 
      { lat: Number(lat), lng: Number(lng) }
    );
    
    res.status(200).json({
      success: true,
      data: updatedRider,
      message: 'Rider location updated successfully'
    });
  } catch (err) {
    console.error('Error updating rider location:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.name === 'CastError' || err.message.includes('Invalid ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rider ID format'
      });
    }
    
    if (err.message.includes('Invalid location data')) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update rider location',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await UserService.getAllRestaurants();
    
    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (err) {
    console.error('Error fetching all restaurants:', err);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getAllRiders = async (req, res) => {
  try {
    const riders = await UserService.getAllRiders();
    
    res.status(200).json({
      success: true,
      data: riders,
      count: riders.length
    });
  } catch (err) {
    console.error('Error fetching all delivery riders:', err);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery riders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
