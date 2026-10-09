import { useCallback, useState } from "react";
import { getCart } from "../services/cart.service";
import { CartContext } from "./cart-context";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
const refreshCart = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const data = await getCart();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch cart");
    }

    setCart(data.cart);
  } catch (error) {
    if (error.response?.status === 401) {
      setError("Please log in to view your shopping cart.");
    } else {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart"
      );
    }

    throw error;
  }
 finally {
    setLoading(false);
  }
}, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        error,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
