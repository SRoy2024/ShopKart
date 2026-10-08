import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const formatPrice = (price) => {
    return "₹" + price.toLocaleString("en-IN");
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/wishlist");

        setWishlist(response.data.wishlist);
      } catch (err) {
        console.error("Wishlist fetch error:", err);

        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Something went wrong while loading your wishlist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, retryCount]);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");

      await api.delete(`/wishlist/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (product) => product._id !== productId
        )
      );
    } catch (err) {
      console.error("Remove wishlist error:", err);

      setError(
        err.response?.data?.message ||
          "Could not remove product from wishlist."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <section className="wishlist-header">
          <div>
            <p className="section-eyebrow">
              Your Saved Products
            </p>

            <h1>Your Wishlist</h1>

            <p>
              Products you've saved for later.
            </p>
          </div>

          {!loading && error && (
            <div className="catalog-state">
                <p className="catalog-error" role="alert">
                {error}
                </p>

                <button
                type="button"
                className="wishlist-browse-btn"
                onClick={() => setRetryCount((count) => count + 1)}
                >
                Try Again
                </button>
            </div>
          )}
        </section>

        {loading && (
          <div className="catalog-state">
            <div
              className="loading-spinner"
              aria-label="Loading"
            />

            <p>Loading your wishlist...</p>
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
          wishlist.length === 0 && (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                ♡
              </div>

              <p className="section-eyebrow">
                Nothing saved yet
              </p>

              <h2>
                Your wishlist is waiting.
              </h2>

              <p>
                Save products you love and
                come back to them anytime.
              </p>

              <button
                type="button"
                className="wishlist-browse-btn"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          wishlist.length > 0 && (
            <section className="wishlist-grid">
              {wishlist.map((product) => {
                const isRemoving =
                  removingId === product._id;

                const isInStock = product.stock > 0;

                return (
                  <article
                    key={product._id}
                    className="wishlist-card"
                  >
                    <div className="wishlist-card-image">
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

                    <div className="wishlist-card-info">
                      <p className="catalog-product-category">
                        {product.category}
                      </p>

                      <h2 className="wishlist-card-name">
                        {product.name}
                      </h2>

                      <p className="wishlist-card-price">
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

                      <div className="wishlist-card-actions">
                        <button
                          type="button"
                          className="view-details-btn"
                          onClick={() =>
                            navigate(
                              `/products/${product._id}`
                            )
                          }
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          className="wishlist-remove-btn"
                          onClick={() =>
                            handleRemove(product._id)
                          }
                          disabled={isRemoving}
                        >
                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
      </main>
    </>
  );
}

export default Wishlist;
