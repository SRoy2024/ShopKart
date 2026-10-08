import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [wishlistState, setWishlistState] = useState("default");
  const [wishlistError, setWishlistError] = useState("");

  const formatPrice = (price) => {
    return "₹" + price.toLocaleString("en-IN");
  };

  const isInStock = product.stock > 0;

  const handleAddToWishlist = async () => {
    // Prevent duplicate requests while one is already running
    if (wishlistState === "saving") {
      return;
    }

    try {
      setWishlistState("saving");
      setWishlistError("");

      await api.post(`/wishlist/${product._id}`);

      setWishlistState("added");
    } catch (err) {
      console.error("Add to wishlist error:", err);

      setWishlistState("default");

      setWishlistError(
        err.response?.data?.message ||
          "Could not add product to wishlist."
      );
    }
  };

  return (
    <article
      className="catalog-product-card"
      id={`product-${product._id}`}
    >
      <div className="catalog-product-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <span
          className={
            isInStock
              ? "stock-badge in-stock"
              : "stock-badge out-of-stock"
          }
        >
          {isInStock
            ? `${product.stock} left`
            : "Out of stock"}
        </span>
      </div>

      <div className="catalog-product-info">
        <p className="catalog-product-category">
          {product.category}
        </p>

        <h3 className="catalog-product-name">
          {product.name}
        </h3>

        <p className="catalog-product-price">
          {formatPrice(product.price)}
        </p>

        <p
          className={
            isInStock
              ? "catalog-stock-text available"
              : "catalog-stock-text unavailable"
          }
        >
          {isInStock
            ? `${product.stock} units available`
            : "Currently unavailable"}
        </p>

        <button
          className="view-details-btn"
          type="button"
          onClick={() =>
            navigate(`/products/${product._id}`)
          }
        >
          View Details
        </button>

        <button
          className="wishlist-btn"
          type="button"
          onClick={handleAddToWishlist}
          disabled={
            wishlistState === "saving" ||
            wishlistState === "added"
          }
        >
          {wishlistState === "default" && "♡ Add to Wishlist"}

          {wishlistState === "saving" && "⏳ Saving..."}

          {wishlistState === "added" && "♥ Added to Wishlist"}
        </button>

        {wishlistError && (
          <p className="wishlist-error">
            {wishlistError}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;