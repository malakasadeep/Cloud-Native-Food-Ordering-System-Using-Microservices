import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restaurant_owner', 'delivery_rider'], required: true },

  name: { type: String },
  mobile: { type: String },
  nic: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  
  restaurant: {
    name: String,
    address: String,
    city: String,
    location: {
      lat: Number,
      lng: Number
    },
    openingTime: String,
    closingTime: String,
    availability: { type: Boolean, default: true },
    coverImageURL: String
  },

  
  vehicleType: String,
  vehicleNo: String,
  licenseImageURL: String,
  currentLocation: {
    lat: Number,
    lng: Number
  }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
