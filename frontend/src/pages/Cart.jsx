
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import {
  updateCartQuantity,
  removeFromCart,
  clearCart
} from "../services/cart.service";
import Navbar from "../components/Navbar";

function Cart() {
  const {
    cart,
    setCart,
    loading,
    error,
    refreshCart
  } = useCart();

  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    refreshCart().catch(() => {
      // The context already stores the error.
    });
  }, [refreshCart]);

  const handleQuantityChange = async (productId, quantity) => {
    if (actionLoading || quantity < 1) return;

    try {
      setActionLoading(productId);
      setActionError("");

      const data = await updateCartQuantity(productId, quantity);

      if (!data.success) {
        throw new Error(
          data.message || "Could not update quantity."
        );
      }

      setCart(data.cart);
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Could not update quantity."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRemoveItem = async (productId) => {
    if (actionLoading) return;

    try {
      setActionLoading(productId);
      setActionError("");

      const data = await removeFromCart(productId);

      if (!data.success) {
        throw new Error(
          data.message || "Could not remove item."
        );
      }

      setCart(data.cart);
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Could not remove item."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleClearCart = async () => {
    if (actionLoading) return;

    try {
      setActionLoading("clear");
      setActionError("");

      const data = await clearCart();

      if (!data.success) {
        throw new Error(
          data.message || "Could not clear cart."
        );
      }

      setCart(data.cart);
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Could not clear cart."
      );
    } finally {
      setActionLoading("");
    }
  };

  const subtotal = cart.reduce((total, item) => {
    const price = item.product?.price ?? 0;
    return total + price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="cart-page">
        <h1>Your Shopping Cart</h1>
        <p>Loading your cart...</p>
      </main>
      </>
    );
  }

  if (error) {
    return (
      <>
      <Navbar />
      <main className="cart-page">
        <h1>Your Shopping Cart</h1>

      <p role="alert">{error}</p>

      {error === "Please log in to view your shopping cart." ? (
        <p>
          <Link to="/login">Log in to continue</Link>
        </p>
      ) : (
        <button
          type="button"
          onClick={() => refreshCart().catch(() => {})}
        >
          Try Again
        </button>
      )}

      <p>
        <Link to="/products">Continue shopping</Link>
      </p>


      </main>
      </>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Shopping Cart</h1>

      {actionError && (
        <p className="cart-error" role="alert">
          {actionError}
        </p>
      )}

      {cart.length === 0 ? (
        <section className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Browse products and add something you like.</p>
          <Link to="/products">Continue shopping</Link>
        </section>
      ) : (
        <>
          <section className="cart-items">
            {cart.map((item) => {
              const product = item.product;

               if (!product) {
                return (
                    <article
                    className="cart-item"
                    key={item._id}
                    >
                    <p>
                        This product is no longer available. Clear your cart
                        to remove unavailable items.
                    </p>
                    </article>
                );
                }



              return (
                <article
                  className="cart-item"
                  key={item._id}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width="100"
                    loading="lazy"
                  />

                  <div className="cart-item-details">
                    <h2>{product.name}</h2>

                    <p>
                      Price: ₹{product.price.toFixed(2)}
                    </p>

                    <div className="cart-quantity-controls">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          actionLoading !== "" ||
                          item.quantity <= 1
                        }
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        −
                      </button>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          actionLoading !== "" ||
                          item.quantity >= product.stock
                        }
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <p>
                      Item total: ₹
                      {(product.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(product._id)
                      }
                      disabled={actionLoading !== ""}
                    >
                      {actionLoading === product._id
                        ? "Processing..."
                        : "Remove"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="cart-summary">
            <h2>Order Summary</h2>

            <p>
              Subtotal:{" "}
              <strong>₹{subtotal.toFixed(2)}</strong>
            </p>

            <Link to="/products">
              Continue shopping
            </Link>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={actionLoading !== ""}
            >
              {actionLoading === "clear"
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          </section>
        </>
      )}
    </main>
  );
}

export default Cart;