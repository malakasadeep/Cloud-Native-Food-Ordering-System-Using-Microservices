import Cart from "../models/cartModel.js";

// Helper: calculate total amount
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.unitPrice * item.qty, 0);
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.params.customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or Update Item in Cart
export const addToCart = async (req, res) => {
  try {
    const { customerId, itemId, itemName, unitPrice, qty } = req.body;

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        customerId,
        items: [{ itemId, itemName, unitPrice, qty }],
        totalAmount: unitPrice * qty,
      });
    } else {
      // Update existing cart
      const existingItem = cart.items.find(
        (item) => item.itemId.toString() === itemId
      );

      if (existingItem) {
        existingItem.qty += qty; // update quantity
      } else {
        cart.items.push({ itemId, itemName, unitPrice, qty }); // add new item
      }

      cart.totalAmount = calculateTotal(cart.items);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { customerId, itemId } = req.body;
    const cart = await Cart.findOne({ customerId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);
    cart.totalAmount = calculateTotal(cart.items);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear Entire Cart
export const clearCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cart = await Cart.findOne({ customerId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
