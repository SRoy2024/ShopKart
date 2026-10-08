import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return "₹" + price.toLocaleString("en-IN");
  };

  const isInStock = product.stock > 0;

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
      </div>
    </article>
  );
}

export default ProductCard;