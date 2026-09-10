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

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Logout failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <Link
        className="navbar-brand"
        to="/home"
      >
        ShopKart
      </Link>

      <div className="navbar-actions">
        {error && (
          <span className="navbar-error">
            {error}
          </span>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;