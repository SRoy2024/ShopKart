import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductCard({
  product,
  isWishlisted,
  onWishlistChange
}) {
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
const [wishlistError, setWishlistError] = useState("");

  const formatPrice = (price) => {
    return "₹" + price.toLocaleString("en-IN");
  };

  const isInStock = product.stock > 0;

  
const handleToggleWishlist = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setWishlistError("");

      const response = await api.patch(
        `/wishlist/${product._id}/toggle`
      );

      onWishlistChange(product._id, response.data.isWishlisted);
    } catch (err) {
      console.error("Toggle wishlist error:", err);

      setWishlistError(
        err.response?.data?.message ||
          "Could not update wishlist."
      );
    } finally {
      setIsSaving(false);
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
          onClick={handleToggleWishlist}
          disabled={isSaving}
        >
          {isSaving
            ? "⏳ Saving..."
            : isWishlisted
              ? "♥ Remove from Wishlist"
              : "♡ Add to Wishlist"}
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