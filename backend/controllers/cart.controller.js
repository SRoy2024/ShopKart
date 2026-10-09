
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const customer = req.user;

    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    const nextQuantity = existingItem
      ? existingItem.quantity + 1
      : 1;

    if (nextQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock"
      });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      customer.cart.push({
        product: product._id,
        quantity: 1
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category"
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const getCart = async (req, res) => {
  try {
    const customer = req.user;

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category"
    });

    return res.status(200).json({
      success: true,
      cart: customer.cart
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number"
      });
    }

    const customer = req.user;

    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product no longer exists"
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock"
      });
    }

    cartItem.quantity = quantity;

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category"
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: customer.cart
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const customer = req.user;

    const cartItemExists = customer.cart.some(
      (item) => item.product.toString() === productId
    );

    if (!cartItemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category"
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const clearCart = async (req, res) => {
  try {
    const customer = req.user;

    customer.cart = [];

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: customer.cart
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart };