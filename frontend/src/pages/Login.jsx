import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      await api.post("/customers/login", formData);
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-minimal-page">
      {/* Logo */}
      <div className="auth-minimal-logo">
        <span className="aml-shop">Shop</span><span className="aml-kart">Kart</span>
      </div>

      {/* Card */}
      <div className="auth-minimal-card">
        <h1 className="auth-minimal-heading">Welcome back</h1>
        <p className="auth-minimal-sub">Sign in to your account</p>

        <form className="auth-minimal-form" onSubmit={handleSubmit} noValidate>
          <div className="amf-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="amf-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="amf-error" role="alert">{error}</p>
          )}

          <button
            className="amf-submit"
            type="submit"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-minimal-switch">
          No account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;