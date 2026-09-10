import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

/* ============================================================
   FAKE PRODUCTS DATA — purely for display, no backend calls
   ============================================================ */
const FAKE_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Noise Cancelling Headphones",
    category: "Electronics",
    price: 22999,
    originalPrice: 34990,
    discount: 34,
    rating: 4.9,
    reviews: 8241,
    badge: "bestseller",
    badgeLabel: "Best Seller",
    delivery: "10-min delivery",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Apple Watch Series 9 — Midnight",
    category: "Wearables",
    price: 38999,
    originalPrice: 45900,
    discount: 15,
    rating: 4.8,
    reviews: 5632,
    badge: "new",
    badgeLabel: "New",
    delivery: "Express — 20 mins",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Nike Air Max 270 React — Fire Edition",
    category: "Footwear",
    price: 8995,
    originalPrice: 13995,
    discount: 36,
    rating: 4.7,
    reviews: 3829,
    badge: "sale",
    badgeLabel: "36% Off",
    delivery: "10-min delivery",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Dyson V15 Detect Absolute Vacuum",
    category: "Home",
    price: 49999,
    originalPrice: 62900,
    discount: 20,
    rating: 4.9,
    reviews: 2107,
    badge: "hot",
    badgeLabel: "🔥 Hot",
    delivery: "Express — 30 mins",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Polaroid Now+ Instant Camera — Black",
    category: "Photography",
    price: 11999,
    originalPrice: 15500,
    discount: 23,
    rating: 4.6,
    reviews: 1420,
    badge: "sale",
    badgeLabel: "23% Off",
    delivery: "10-min delivery",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Chanel Bleu de Chanel EDP 100ml",
    category: "Beauty",
    price: 9499,
    originalPrice: 12800,
    discount: 26,
    rating: 4.8,
    reviews: 4591,
    badge: "bestseller",
    badgeLabel: "Best Seller",
    delivery: "Express — 20 mins",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 7,
    name: "MacBook Air M3 — Space Grey 16GB",
    category: "Laptops",
    price: 109999,
    originalPrice: 124900,
    discount: 12,
    rating: 4.9,
    reviews: 11230,
    badge: "hot",
    badgeLabel: "🔥 Hot",
    delivery: "Same-day delivery",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Ray-Ban Clubmaster Sunglasses — Gold",
    category: "Accessories",
    price: 7499,
    originalPrice: 10990,
    discount: 32,
    rating: 4.7,
    reviews: 2384,
    badge: "sale",
    badgeLabel: "32% Off",
    delivery: "10-min delivery",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80",
  },
];

const FLASH_PRODUCTS = [
  {
    id: 101,
    name: "JBL Charge 5",
    price: 7999,
    off: "40% Off",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop&q=80",
  },
  {
    id: 102,
    name: "iPad Pro 11″",
    price: 72999,
    off: "15% Off",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&q=80",
  },
  {
    id: 103,
    name: "Adidas Ultraboost",
    price: 9499,
    off: "30% Off",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop&q=80",
  },
];

const CATEGORIES = [
  { emoji: "🛍️", label: "All" },
  { emoji: "📱", label: "Electronics" },
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

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="star" aria-hidden="true">
      {i < Math.floor(rating) ? "★" : i < rating ? "⭐" : "☆"}
    </span>
  ));
}

/* ---- Countdown Timer ---- */
function useCountdown(targetSecs) {
  const [secs, setSecs] = useState(targetSecs);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return { h, m, s };
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

  const { h, m, s } = useCountdown(4 * 3600 + 22 * 60 + 38);

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

  /* -- filtered products -- */
  const filteredProducts =
    activeCategory === "All"
      ? FAKE_PRODUCTS
      : FAKE_PRODUCTS.filter((p) => p.category === activeCategory);

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
              <span className="btn-primary">🛒 Browse Products</span>
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
                {FAKE_PRODUCTS.slice(0, 3).map((p) => (
                  <div key={p.id} className="phone-product-item">
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
            <span className="see-all-link">View all →</span>
          </div>

          {filteredProducts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
              No products found in this category yet.
            </p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="product-card"
                  id={`product-${product.id}`}
                  aria-label={product.name}
                >
                  <div className="product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    <span className={`product-badge ${product.badge}`}>
                      {product.badgeLabel}
                    </span>
                    <button className="product-wishlist" aria-label="Add to wishlist">
                      🤍
                    </button>
                    <div className="product-delivery-tag">
                      ⚡ {product.delivery}
                    </div>
                  </div>

                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-rating">
                      <div className="product-stars">{renderStars(product.rating)}</div>
                      <span className="product-rating-count">
                        {product.rating} ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    <div className="product-pricing">
                      <div className="price-group">
                        <span className="price-current">
                          {formatPrice(product.price)}
                        </span>
                        <span className="price-original">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="price-discount">
                          -{product.discount}%
                        </span>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        aria-label={`Add ${product.name} to cart`}
                        id={`add-cart-${product.id}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ FLASH SALE BANNER ============ */}
      <section className="flash-sale-section">
        <div className="section-container">
          <div className="flash-sale-banner">
            <div className="flash-sale-text">
              <div className="flash-sale-eyebrow">
                <span className="flash-badge">⚡ Flash Sale</span>
              </div>
              <h2 className="flash-sale-title">
                Up to <span className="highlight">70% Off</span><br />
                Today Only!
              </h2>
              <p className="flash-sale-sub">
                Hop fast — these deals vanish when the timer hits zero.
              </p>

              {/* Countdown */}
              <div className="countdown-wrap">
                <span className="countdown-label">Ends in:</span>
                {[
                  { num: h, sub: "HRS" },
                  { num: m, sub: "MIN" },
                  { num: s, sub: "SEC" },
                ].map((unit, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="countdown-unit">
                      <span className="countdown-num">{unit.num}</span>
                      <span className="countdown-sub">{unit.sub}</span>
                    </span>
                    {i < 2 && <span className="countdown-sep">:</span>}
                  </span>
                ))}
              </div>

              <span className="btn-primary" style={{ display: "inline-flex", width: "fit-content" }}>
                🛒 Shop the Sale
              </span>
            </div>

            {/* Flash products */}
            <div className="flash-sale-products">
              {FLASH_PRODUCTS.map((fp) => (
                <div key={fp.id} className="flash-product-card">
                  <img src={fp.image} alt={fp.name} loading="lazy" />
                  <div className="flash-product-card-info">
                    <p>{fp.name}</p>
                    <span className="fp-price">{formatPrice(fp.price)}</span>
                    <span className="fp-off"> · {fp.off}</span>
                  </div>
                </div>
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