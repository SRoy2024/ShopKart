
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../hooks/useCart";
import { createPaymentOrder, verifyPayment } from "../services/orderService";
import "./Checkout.css";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: ""
};

function Checkout() {
  const navigate = useNavigate();
  const { cart, setCart, loading: cartLoading, error: cartError, refreshCart } = useCart();

  const [address, setAddress] = useState(initialAddress);
  const [formErrors, setFormErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.Razorpay)
  );

  useEffect(() => {
    refreshCart().catch(() => {});

    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-razorpay-checkout="true"]'
    );

    const script = existingScript || document.createElement("script");

    const handleLoad = () => setRazorpayReady(true);
    const handleError = () => {
      setPageError("Could not load Razorpay. Check your connection and reload the page.");
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.dataset.razorpayCheckout = "true";
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [refreshCart]);

  const subtotal = cart.reduce((total, item) => {
    return total + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: ""
    }));

    setPageError("");
  };

  const validateAddress = () => {
    const errors = {};

    for (const [field, value] of Object.entries(address)) {
      if (!value.trim()) {
        errors[field] = "This field is required.";
      }
    }

    const phone = address.phone.trim();
    if (phone && !/^(?:\+91[- ]?)?[6-9]\d{9}$/.test(phone)) {
      errors.phone = "Enter a valid Indian mobile number.";
    }

    const pincode = address.pincode.trim();
    if (pincode && !/^\d{6}$/.test(pincode)) {
      errors.pincode = "Enter a valid 6-digit pincode.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setPageError("");

    if (!validateAddress()) return;

    if (cart.length === 0) {
      setPageError("Your cart is empty. Add products before checking out.");
      return;
    }

    if (!razorpayReady || !window.Razorpay) {
      setPageError("Razorpay is still loading. Please try again in a moment.");
      return;
    }

    setSubmitting(true);

    try {
      // The backend calculates the actual amount and rechecks stock.
      const paymentOrder = await createPaymentOrder(address);

      if (!paymentOrder.success) {
        throw new Error(paymentOrder.message || "Could not create payment order.");
      }

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "ShopKart",
        description: "ShopKart purchase",
        order_id: paymentOrder.razorpayOrderId,

        handler: async (response) => {
          try {
            const result = await verifyPayment({
              shopKartOrderId: paymentOrder.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (!result.success) {
              throw new Error(result.message || "Payment verification failed.");
            }

            // Clear the shared cart only after backend verification succeeds.
            setCart([]);
            navigate(`/order-success/${paymentOrder.shopKartOrderId}`, {
              replace: true
            });
          } catch (error) {
            setPageError(
              error.response?.data?.message ||
                error.message ||
                "Payment verification could not be completed. Do not pay again yet; check your order status."
            );
            setSubmitting(false);
          }
        },

        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setPageError(
              "Checkout was closed. Your cart has been kept. If you completed payment, check your order status before trying again."
            );
          }
        },

        theme: {
          color: "#0D1117"
        }
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setPageError(
          response.error?.description ||
            "Payment failed. Your cart has been kept; you can try again."
        );
        setSubmitting(false);
      });

      checkout.open();
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          error.message ||
          "Could not start checkout. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <p>Loading your cart...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <h1>Checkout</h1>

        {pageError && (
          <p className="checkout-error" role="alert">
            {pageError}
          </p>
        )}

        {cartError && (
          <p className="checkout-error" role="alert">
            {cartError}
          </p>
        )}

        {cart.length === 0 ? (
          <section>
            <h2>Your cart is empty</h2>
            <p>Add products before proceeding to checkout.</p>
            <Link to="/products">Browse products</Link>
          </section>
        ) : (
          <div className="checkout-layout">
            <form onSubmit={handleCheckout} noValidate>
              <h2>Shipping Address</h2>

              {[
                { name: "fullName", label: "Full name", autoComplete: "name" },
                { name: "phone", label: "Mobile number", autoComplete: "tel" },
                { name: "addressLine1", label: "Address", autoComplete: "street-address" },
                { name: "city", label: "City", autoComplete: "address-level2" },
                { name: "state", label: "State", autoComplete: "address-level1" },
                { name: "pincode", label: "6-digit pincode", autoComplete: "postal-code" }
              ].map((field) => (
                <div className="checkout-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    autoComplete={field.autoComplete}
                    value={address[field.name]}
                    onChange={handleChange}
                    aria-invalid={Boolean(formErrors[field.name])}
                    aria-describedby={
                      formErrors[field.name] ? `${field.name}-error` : undefined
                    }
                    disabled={submitting}
                  />
                  {formErrors[field.name] && (
                    <p id={`${field.name}-error`} role="alert">
                      {formErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting || !razorpayReady}
              >
                {submitting
                  ? "Processing..."
                  : !razorpayReady
                    ? "Loading payment..."
                    : `Pay ₹${subtotal.toFixed(2)}`}
              </button>

              <p>Payments are processed using Razorpay Test Mode.</p>
            </form>

            <section className="checkout-summary">
              <h2>Order Summary</h2>
              <p>Items: {itemCount}</p>

              {cart.map((item) => (
                <div
                  className="checkout-summary-item"
                  key={item._id || item.product?._id}
                >
                  <span>
                    {item.product?.name || "Unavailable product"} × {item.quantity}
                  </span>
                  <strong>
                    ₹{(
                      (item.product?.price ?? 0) * item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}

              <hr />
              <p>
                Subtotal: <strong>₹{subtotal.toFixed(2)}</strong>
              </p>
              <p>Shipping: Calculated by the store</p>
              <p>
                <strong>Total shown: ₹{subtotal.toFixed(2)}</strong>
              </p>
              <Link to="/cart">Return to cart</Link>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

export default Checkout;