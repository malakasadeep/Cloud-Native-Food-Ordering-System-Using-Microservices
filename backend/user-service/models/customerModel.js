import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  address: String,
  postalCode: String,
  location: {
    lat: Number,
    lng: Number,
  },
  secondaryAddresses: [String],
  paymentDetails: [
    {
      type: Map,
      of: String, // could be customized for cards, PayPal etc.
    }
  ],
  isProfileCompleted: { type: Boolean, default: false },
  role: { type: String,  default: 'customer' },
  avatar: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dgckCEFdaR4QrzY1cdQTF_VzmwmPkSV2UA&usqp=CAU",
  },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;