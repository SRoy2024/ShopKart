const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createPaymentOrder = async (req, res) => {
  let shopKartOrder;

  try {
    const { shippingAddress } = req.body;

    // 1. Validate shipping details on the backend.
    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "pincode"
    ];

    if (
      !shippingAddress ||
      typeof shippingAddress !== "object" ||
      Array.isArray(shippingAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required."
      });
    }

    for (const field of requiredFields) {
      if (
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`
        });
      }
    }

    const cleanAddress = {
      fullName: shippingAddress.fullName.trim(),
      phone: shippingAddress.phone.trim(),
      addressLine1: shippingAddress.addressLine1.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pincode: shippingAddress.pincode.trim()
    };

    if (!/^(?:\+91[- ]?)?[6-9]\d{9}$/.test(cleanAddress.phone)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid Indian phone number."
      });
    }

    if (!/^\d{6}$/.test(cleanAddress.pincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must contain 6 digits."
      });
    }

    // 2. Load the authenticated customer and their current cart.
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found. Please log in again."
      });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty."
      });
    }

    // 3. Fetch the latest product information and validate stock.
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      if (
        !Number.isInteger(cartItem.quantity) ||
        cartItem.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity in your cart."
        });
      }

      if (!mongoose.isValidObjectId(cartItem.product)) {
        return res.status(400).json({
          success: false,
          message: "Your cart contains an invalid product."
        });
      }

      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart is no longer available."
        });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}.`
        });
      }

      // 4. Snapshot purchase-time product details.
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image
      });

      totalAmount += product.price * cartItem.quantity;
    }

    // Avoid floating-point precision issues when handling currency.
    totalAmount = Number(totalAmount.toFixed(2));

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "The calculated order amount is invalid."
      });
    }

    // 5. Persist the pending ShopKart order first.
    shopKartOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: cleanAddress,
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    // 6. Create the Razorpay Order on the server.
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: shopKartOrder._id.toString()
    });

    // 7. Associate the Razorpay Order with the ShopKart order.
    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    // 8. Return only the information needed by Razorpay Checkout.
    return res.status(201).json({
      success: true,
      message: "Payment order created successfully.",
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    // Remove the pending order if Razorpay order creation or
    // association failed. The customer's cart remains untouched.
    if (shopKartOrder) {
      try {
        await Order.deleteOne({ _id: shopKartOrder._id });
      } catch (cleanupError) {
        console.error(
          "Pending order cleanup failed:",
          cleanupError.message
        );
      }
    }

    console.error("Create payment order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not create the payment order. Please try again."
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      typeof shopKartOrderId !== "string" ||
      !mongoose.isValidObjectId(shopKartOrderId) ||
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !/^[a-fA-F0-9]{64}$/.test(razorpay_signature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment verification details."
      });
    }

    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    if (
      !order.razorpayOrderId ||
      order.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Order ID does not match."
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    const signatureIsValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signatureIsValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    // Repeated verification must not clear the cart again.
    if (order.paymentStatus === "PAID") {
      if (order.razorpayPaymentId !== razorpay_payment_id) {
        return res.status(409).json({
          success: false,
          message: "This order has already been paid."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment was already verified.",
        order
      });
    }

    // Only one concurrent request may perform the payment transition.
    const paidOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        user: req.user._id,
        paymentStatus: { $ne: "PAID" }
      },
      {
        $set: {
          paymentStatus: "PAID",
          status: "PLACED",
          razorpayPaymentId: razorpay_payment_id
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!paidOrder) {
      const latestOrder = await Order.findOne({
        _id: shopKartOrderId,
        user: req.user._id
      });

      if (
        latestOrder?.paymentStatus === "PAID" &&
        latestOrder.razorpayPaymentId === razorpay_payment_id
      ) {
        return res.status(200).json({
          success: true,
          message: "Payment was already verified.",
          order: latestOrder
        });
      }

      return res.status(409).json({
        success: false,
        message: "Order state changed. Please check your order status."
      });
    }

    // Remove only cart entries whose product and quantity still match.
    for (const item of paidOrder.items) {
      await Customer.updateOne(
        { _id: req.user._id },
        {
          $pull: {
            cart: {
              product: item.product,
              quantity: item.quantity
            }
          }
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully.",
      order: paidOrder
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify payment. Please check your order status."
    });
  }
};

const getMyOrders = async (req, res) => {
try {
const orders = await Order.find({
user: req.user._id
}).sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  orders
});


} catch (error) {
console.error("Get orders error:", error.message);

return res.status(500).json({
  success: false,
  message: "Could not fetch your orders."
});

}
};

const getOrderById = async (req, res) => {
try {
const { id } = req.params;

if (!mongoose.isValidObjectId(id)) {
  return res.status(404).json({
    success: false,
    message: "Order not found."
  });
}

// Only return an order owned by the authenticated customer.
const order = await Order.findOne({
  _id: id,
  user: req.user._id
});

if (!order) {
  return res.status(404).json({
    success: false,
    message: "Order not found."
  });
}

return res.status(200).json({
  success: true,
  order
});


} catch (error) {
console.error("Get order details error:", error.message);


return res.status(500).json({
  success: false,
  message: "Could not fetch order details."
});


}
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
};