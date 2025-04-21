import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModel.js';
dotenv.config();

const SECRET = process.env.JWT_SECRET

export const createUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('Email already registered');

  data.password = await bcrypt.hash(data.password, 10);
  return await User.create(data);
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });
  return { token, user };
};

export const viewAll = async () => {
  return await User.find();
};

export const viewById = async (id) => {
  return await User.findById(id);
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const updateStatus = async (id, status) => {
  return await User.findByIdAndUpdate(id, { status }, { new: true });
};

export const updateDetails = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await User.findByIdAndUpdate(id, data, { new: true });
};
