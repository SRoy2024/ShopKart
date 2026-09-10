import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError("");
      await api.post("/customers/logout");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <Link className="navbar-brand" to="/home">
        <div className="navbar-logo-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h2l2.68 5.39M7.68 8.39L9 14h9l1.5-8H7.68z" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="17" r="1.2" fill="#C9A84C"/>
            <circle cx="17" cy="17" r="1.2" fill="#C9A84C"/>
            <path d="M13 6l-2 3h3l-2 3" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="navbar-left">
          <span className="navbar-logo-text">
            <span className="sk-s">Shop</span><span className="sk-k">Kart</span>
          </span>
          <span className="navbar-tagline">Hop. Shop. Delivered.</span>
        </div>
      </Link>

      {/* Nav Actions */}
      <div className="navbar-actions">
        {/* Speed delivery badge */}
        <div className="navbar-badge" title="Fast delivery guarantee">
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.5 3h3L8 6l1 3.5L6 8 3 9.5l1-3.5L1.5 4h3z" fill="currentColor"/>
          </svg>
          10-min delivery
        </div>

        {error && <span className="navbar-error">{error}</span>}

        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={loading}
          id="logout-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {loading ? "Logging out…" : "Logout"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;