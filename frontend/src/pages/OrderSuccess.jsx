
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/orderService";

function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        if (!data.success || !data.order) {
          throw new Error(data.message || "Could not fetch order details.");
        }

        if (active) {
          setOrder(data.order);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Could not load your order."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="order-success-page">
        {loading ? (
          <p>Loading your order confirmation...</p>
        ) : error ? (
          <section>
            <h1>Unable to load order</h1>
            <p role="alert">{error}</p>
            <Link to="/orders">View My Orders</Link>
            {" · "}
            <Link to="/products">Continue shopping</Link>
          </section>
        ) : order?.paymentStatus !== "PAID" ? (
          <section>
            <h1>Payment not yet confirmed</h1>
            <p>
              We could not confirm successful payment for this order.
              Please check your order history before attempting another payment.
            </p>
            <Link to="/orders">View My Orders</Link>
          </section>
        ) : (
          <section>
            <h1>Order placed successfully!</h1>
            <p>Your payment has been verified. Thank you for shopping with ShopKart.</p>

            <p>
              <strong>Order ID:</strong> {order._id}
            </p>

            <p>
              <strong>Order status:</strong> {order.status}
            </p>

            <p>
              <strong>Payment status:</strong> {order.paymentStatus}
            </p>

            <h2>Items ordered</h2>

            <div className="order-success-items">
              {order.items.map((item, index) => (
                <article
                  className="order-success-item"
                  key={`${item.product}-${index}`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      width="80"
                      loading="lazy"
                    />
                  )}

                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{Number(item.price).toFixed(2)}</p>
                    <p>
                      Item total: ₹
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <h2>Shipping address</h2>
            <address>
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              {" - "}
              {order.shippingAddress.pincode}
              <br />
              Phone: {order.shippingAddress.phone}
            </address>

            <h2>
              Total paid: ₹{Number(order.totalAmount).toFixed(2)}
            </h2>

            <div className="order-success-actions">
              <Link to="/orders">View My Orders</Link>
              {" · "}
              <Link to="/products">Continue shopping</Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default OrderSuccess;