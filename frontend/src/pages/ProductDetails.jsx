import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        setProduct(
          response.data.product
        );

      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (err.response?.status === 404) {
          setError(
            "Product not found."
          );
        } else if (
          err.response?.status === 400
        ) {
          setError(
            "Invalid product ID."
          );
        } else {
          setError(
            "Something went wrong while loading the product."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [id]);

  const formatPrice = (price) => {
    return "₹" +
      price.toLocaleString("en-IN");
  };

  const isInStock =
    product?.stock > 0;

  return (
    <>
      <Navbar />

      <main className="product-details-page">
        <div className="product-details-container">
          <Link
            to="/products"
            className="product-back-link"
          >
            ← Back to products
          </Link>

          {loading && (
            <div className="catalog-state">
              <div
                className="loading-spinner"
                aria-label="Loading"
              />

              <p>
                Loading product...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="catalog-state">
              <p className="catalog-error">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            product && (
              <section className="product-details-card">
                <div className="product-details-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="product-details-content">
                  <p className="section-eyebrow">
                    {product.category}
                  </p>

                  <h1>
                    {product.name}
                  </h1>

                  <p className="product-details-description">
                    {product.description}
                  </p>

                  <p className="product-details-price">
                    {formatPrice(
                      product.price
                    )}
                  </p>

                  <div className="product-details-stock">
                    <span>
                      Stock
                    </span>

                    <strong
                      className={
                        isInStock
                          ? "stock-value available"
                          : "stock-value unavailable"
                      }
                    >
                      {isInStock
                        ? `${product.stock} units available`
                        : "Out of stock"}
                    </strong>
                  </div>

                  <button
                    className="product-add-cart-btn"
                    type="button"
                    disabled={!isInStock}
                  >
                    {isInStock
                      ? "🛒 Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </section>
            )}
        </div>
      </main>
    </>
  );
}

export default ProductDetails;