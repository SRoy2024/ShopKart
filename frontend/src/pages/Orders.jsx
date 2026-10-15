
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();

      if (!data.success || !Array.isArray(data.orders)) {
        throw new Error(data.message || "Could not fetch your orders.");
      }

      setOrders(data.orders);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <h1>My Orders</h1>

        {loading ? (
          <p>Loading your orders...</p>
        ) : error ? (
          <section>
            <p role="alert">{error}</p>
            <button type="button" onClick={fetchOrders}>
              Try Again
            </button>
          </section>
        ) : orders.length === 0 ? (
          <section className="orders-empty">
            <h2>No orders yet</h2>
            <p>Your placed orders will appear here.</p>
            <Link to="/products">Start shopping</Link>
          </section>
        ) : (
          <section className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                    <p>
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>

                  <div>
                    <p>
                      <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                    </p>
                    <p>Payment: {order.paymentStatus}</p>
                    <p>Status: {order.status.replaceAll("_", " ")}</p>
                  </div>
                </div>

                <div className="order-card-items">
                  {order.items.map((item, index) => (
                    <div
                      className="order-card-item"
                      key={`${item.product}-${index}`}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          width="64"
                          loading="lazy"
                        />
                      )}

                      <div>
                        <p>{item.name}</p>
                        <p>
                          Qty: {item.quantity} × ₹
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to={`/orders/${order._id}`}>
                  View order details
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Orders;