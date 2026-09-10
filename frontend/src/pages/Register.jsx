import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password || !formData.phone.trim())
      return "All fields are required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validateForm();
    if (err) { setError(err); return; }
    try {
      setLoading(true);
      await api.post("/customers/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
        <h1 className="auth-minimal-heading">Create account</h1>
        <p className="auth-minimal-sub">It's free — takes 30 seconds</p>

        <form className="auth-minimal-form" onSubmit={handleSubmit} noValidate>
          <div className="amf-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <div className="amf-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          {error && (
            <p className="amf-error" role="alert">{error}</p>
          )}

          <button
            className="amf-submit"
            type="submit"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-minimal-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;