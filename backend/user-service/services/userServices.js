import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModel.js';
import { notifyEmail } from '../utils/notify.js';
import { getPasswordEmailTemplate } from '../templates/passwordSentTemplate.js';
import { getRejectionEmailTemplate } from '../templates/rejectionEmailTemplate.js';
import generatePassword from '../utils/passwordGenerator.js';
dotenv.config();

const SECRET = process.env.JWT_SECRET

export const createUser = async (data) => {
  try {
    if (!data.email || !data.role) {
      throw new Error('Required fields are missing');
    }
    
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('Email already registered');

    return await User.create(data);
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    
    if (user.status === 'pending') {
      throw new Error('Your account is pending approval');
    }
    
    if (user.status === 'reject') {
      throw new Error('Your account has been rejected');
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });
    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const viewAll = async () => {
  try {
    return await User.find().select('-password');
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

export const viewById = async (id) => {
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new Error('Invalid ID format');
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new Error('Invalid ID format');
    }
    throw error;
  }
};

export const updateStatus = async (id, status, reason) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  if (status === 'approved') {
    const generatedPassword = generatePassword(8);
    
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { status, password: hashedPassword }, 
      { new: true }
    );
    
    try {
      const emailTemplate = getPasswordEmailTemplate(user.name, generatedPassword);
      await notifyEmail(
        user.email,
        'Your Account is Approved - Food Delivery System',
        emailTemplate
      );
    } catch (error) {
      console.error('Failed to send password email:', error);
      
    }
    
    return updatedUser;
  } else if (status === 'reject') {
    // Update user with rejected status
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    // Send rejection email to user
    try {
      const emailTemplate = getRejectionEmailTemplate(user.name, reason);
      await notifyEmail(
        user.email,
        'Account Registration Status - Food Delivery System',
        emailTemplate
      );
    } catch (error) {
      console.error('Failed to send rejection email:', error);
      // Still returning the updated user even if email fails
    }
    
    return updatedUser;
  }
  
  // If not approved or rejected, just update the status
  return await User.findByIdAndUpdate(id, { status }, { new: true });
};

export const updateDetails = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await User.findByIdAndUpdate(id, data, { new: true });
};


