import mongoose from "mongoose";

const foodMenuSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
  },
},{
  timestamps: true,
  });

const FoodMenu = mongoose.model("FoodMenu", foodMenuSchema);
export default FoodMenu;
