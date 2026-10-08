import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { emoji: "🛍️", label: "All" },
  { emoji: "📱", label: "Electronics" },
  { emoji: "👕", label: "Fashion" },
  { emoji: "📚", label: "Books" },
  { emoji: "👟", label: "Footwear" },
  { emoji: "🏠", label: "Home" },
  { emoji: "💄", label: "Beauty" },
  { emoji: "📸", label: "Photography" },
  { emoji: "💻", label: "Laptops" },
  { emoji: "🕶️", label: "Accessories" },
  { emoji: "⌚", label: "Wearables" },
];

/* ---- Helpers ---- */
function formatPrice(n) {
  return "₹" + n.toLocaleString("en-IN");
}

/* ============================================================
   HOME COMPONENT
   ============================================================ */
function Home() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get("/customers/me");
        setCustomer(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const params = activeCategory === "All" ? {} : { category: activeCategory };
        const response = await api.get("/products", { params });
        setProducts(response.data.products);
      } catch (err) {
        console.error("Home products fetch error:", err);
        setProductsError("Something went wrong while loading products.");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  /* ---- Loading ---- */
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <span>Shop</span>
          <span>Kart</span>
        </div>
        <div className="loading-spinner" aria-label="Loading" />
        <p className="loading-text">Loading your account…</p>
      </div>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  if (!customer) return null;

  return (
    <>
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Left copy */}
          <div>
            <p className="hero-eyebrow">⚡ India's Fastest Delivery</p>
            <h1 className="hero-title">
              Hop. Shop. <br />
              <span className="gradient-text">Delivered Fast.</span>
            </h1>
            <p className="hero-subtitle">
              Hey <strong style={{ color: "#fff" }}>{customer.fullName?.split(" ")[0]}</strong>! Your favourite
              products are just a <strong style={{ color: "#E2C06C" }}>10-minute hop</strong> away.
              From electronics to fashion — ShopKart moves at the speed of life.
            </p>
            <div className="hero-ctas">
              <Link className="btn-primary" to="/products"> 🛒 Browse Products </Link>
              <span className="btn-secondary">🎁 Today's Deals</span>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">10<span>k+</span></span>
                <span className="hero-stat-label">Products</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">2<span>M+</span></span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">10<span>m</span></span>
                <span className="hero-stat-label">Avg Delivery</span>
              </div>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-phone-mockup">
              <div className="phone-screen-header">
                <p>⚡ ShopKart Express</p>
                <h3>Trending near you</h3>
              </div>
              <div className="phone-product-mini">
                {products.slice(0, 3).map((p) => (
                  <div key={p._id} className="phone-product-item">
                    <img
                      className="phone-product-thumb"
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                    />
                    <div className="phone-product-info">
                      <p>{p.name.split(" ").slice(0, 3).join(" ")}</p>
                      <span>{formatPrice(p.price)}</span>
                    </div>
                    <div className="phone-add-btn">+</div>
                  </div>
                ))}
              </div>
              <div className="phone-delivery-badge">
                <span>✅</span>
                <p>Delivered in under 10 minutes!</p>
              </div>
            </div>

            {/* Float cards */}
            <div className="hero-float-card card-top">
              <div className="float-card-icon orange">⚡</div>
              <div className="float-card-text">
                <p>Express Delivery</p>
                <p>Available 24/7</p>
              </div>
            </div>

            <div className="hero-float-card card-bottom">
              <div className="float-card-icon green">🛡️</div>
              <div className="float-card-text">
                <p>Safe &amp; Secure</p>
                <p>100% Buyer Protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ USP STRIP ============ */}
      <div className="usp-strip" role="list">
        {[
          { icon: "⚡", title: "10-Min Delivery", sub: "For eligible pin codes" },
          { icon: "🔄", title: "Easy Returns", sub: "Hassle-free 30-day returns" },
          { icon: "🔒", title: "Secure Payments", sub: "256-bit SSL encryption" },
          { icon: "🎁", title: "Daily Deals", sub: "New offers every day" },
          { icon: "📞", title: "24/7 Support", sub: "Always here to help" },
        ].map((u) => (
          <div key={u.title} className="usp-item" role="listitem">
            <span className="usp-icon">{u.icon}</span>
            <div className="usp-text">
              <p>{u.title}</p>
              <p>{u.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ============ CATEGORIES ============ */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-eyebrow">Browse by</span>
              <h2 className="section-title">Categories</h2>
            </div>
          </div>
          <div className="category-pills">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                id={`cat-${c.label.toLowerCase()}`}
                className={`cat-pill ${activeCategory === c.label ? "active" : ""}`}
                onClick={() => setActiveCategory(c.label)}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS GRID ============ */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-eyebrow">Featured</span>
              <h2 className="section-title">
                {activeCategory === "All" ? "Top Picks For You" : activeCategory}
              </h2>
            </div>
            <Link className="see-all-link" to="/products">View all →</Link>
          </div>

          {productsLoading ? (
            <div className="catalog-state home-products-state">
              <div className="loading-spinner" aria-label="Loading" />
              <p>Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="catalog-state home-products-state">
              <p className="catalog-error">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
              No products found in this category yet.
            </p>
          ) : (
            <div className="catalog-products-grid home-products-grid">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CATALOG HIGHLIGHT ============ */}
      <section className="flash-sale-section">
        <div className="section-container">
          <div className="flash-sale-banner">
            <div className="flash-sale-text">
              <div className="flash-sale-eyebrow">
                <span className="flash-badge">ShopKart Catalogue</span>
              </div>
              <h2 className="flash-sale-title">
                Find your next <span className="highlight">favourite</span><br />
                in the catalogue.
              </h2>
              <p className="flash-sale-sub">
                Browse real products currently available in ShopKart.
              </p>
              <Link className="btn-primary" to="/products" style={{ display: "inline-flex", width: "fit-content" }}>
                🛒 Browse all products
              </Link>
            </div>

            {/* Flash products */}
            <div className="flash-sale-products">
              {products.slice(0, 3).map((fp) => (
                <Link key={fp._id} to={`/products/${fp._id}`} className="flash-product-card">
                  <img src={fp.image} alt={fp.name} loading="lazy" />
                  <div className="flash-product-card-info">
                    <p>{fp.name}</p>
                    <span className="fp-price">{formatPrice(fp.price)}</span>
                    <span className="fp-off"> · {fp.stock > 0 ? `${fp.stock} in stock` : "Out of stock"}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROFILE & ACCOUNT ============ */}
      <section className="profile-section">
        <div className="section-container">
          {/* Welcome header */}
          <div className="welcome-header">
            <p className="welcome-eyebrow">Your ShopKart Account</p>
            <h2 className="welcome-title">
              Welcome back, {customer.fullName?.split(" ")[0]}!
            </h2>
            <p className="welcome-sub">
              You're logged in and ready to hop &amp; shop.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions" style={{ marginBottom: "24px" }}>
            {[
              { icon: "📦", title: "My Orders", sub: "Track your deliveries" },
              { icon: "❤️", title: "Wishlist", sub: "Saved for later" },
              { icon: "💳", title: "Payments", sub: "Manage payment methods" },
              { icon: "📍", title: "Addresses", sub: "Saved locations" },
            ].map((qa) => (
              <div
                key={qa.title}
                className="quick-action-card"
                id={`qa-${qa.title.toLowerCase().replace(" ", "-")}`}
              >
                <div className="qa-icon">{qa.icon}</div>
                <div>
                  <p className="qa-title">{qa.title}</p>
                  <p className="qa-sub">{qa.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-top">
              <div className="profile-avatar" aria-label="Profile avatar">
                {customer.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-card-top-info">
                <h2>{customer.fullName}</h2>
                <p>ShopKart Member</p>
              </div>
              <div className="profile-verified-badge">
                ✓ Verified Account
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{customer.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Phone Number</span>
                <span className="profile-field-value">{customer.phone}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Customer ID</span>
                <span className="profile-field-value">{customer._id}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <p className="footer-logo">
          <span className="f-shop">Shop</span>
          <span className="f-kart">Kart</span>
        </p>
        <p className="footer-copy">
          Hop. Shop. Delivered. · © {new Date().getFullYear()} ShopKart Inc.
        </p>
      </footer>
    </>
  );
}

export default Home;
