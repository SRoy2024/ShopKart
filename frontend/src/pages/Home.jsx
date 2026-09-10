import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(
          "/customers/me"
        );

        setCustomer(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", {
            replace: true,
          });
          return;
        }

        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [navigate]);

  if (loading) {
    return (
      <main className="home-page">
        <p className="status-message">
          Loading your account...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <p className="error-message">
          {error}
        </p>
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="welcome-section">
          <p className="eyebrow">
            SHOPKART ACCOUNT
          </p>

          <h1>
            Welcome, {customer.fullName}
          </h1>

          <p>
            You're successfully logged into your
            ShopKart account.
          </p>
        </section>

        <section className="profile-card">
          <div className="profile-heading">
            <div className="profile-avatar">
              {customer.fullName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2>{customer.fullName}</h2>
              <p>Customer Profile</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-field">
              <span>Email</span>
              <strong>
                {customer.email}
              </strong>
            </div>

            <div className="profile-field">
              <span>Phone Number</span>
              <strong>
                {customer.phone}
              </strong>
            </div>

            <div className="profile-field">
              <span>Customer ID</span>
              <strong>
                {customer._id}
              </strong>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;