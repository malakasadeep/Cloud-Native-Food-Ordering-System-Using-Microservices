import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema({
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
}, { _id: false });

const currentLocationSchema = new Schema({
  lat: Number,
  lng: Number
}, { _id: false });

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'restaurant_owner', 'delivery_rider'], required: true },

  firstname: { type: String },
  lasttname: { type: String },
  mobile: { type: String },
  nic: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  restaurant: {
    type: restaurantSchema,
    validate: {
      validator: function(v) {
        // Only allow restaurant data for restaurant_owner
        if (!v) return true;
        return this.role === 'restaurant_owner';
      },
      message: 'Restaurant details can only be provided for restaurant owners'
    }
  },

  vehicleType: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return this.role === 'delivery_rider';
      },
      message: 'Vehicle type can only be provided for delivery riders'
    }
  },
  vehicleNo: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return this.role === 'delivery_rider';
      },
      message: 'Vehicle number can only be provided for delivery riders'
    }
  },
  licenseImageURL: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return this.role === 'delivery_rider';
      },
      message: 'License image can only be provided for delivery riders'
    }
  },
  currentLocation: {
    type: currentLocationSchema,
    validate: {
      validator: function(v) {
        if (!v || (v.lat === undefined && v.lng === undefined)) return true;
        return this.role === 'delivery_rider';
      },
      message: 'Current location can only be provided for delivery riders'
    }
  }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
