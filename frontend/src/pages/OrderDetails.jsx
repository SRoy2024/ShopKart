
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/orderService";

function OrderDetails() {
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
              "Could not load order details."
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

      <main className="order-details-page">
        <p>
          <Link to="/orders">← Back to My Orders</Link>
        </p>

        {loading ? (
          <p>Loading order details...</p>
        ) : error ? (
          <section>
            <h1>Unable to load order</h1>
            <p role="alert">{error}</p>
            <Link to="/orders">Return to My Orders</Link>
          </section>
        ) : (
          <>
            <h1>Order Details</h1>

            <section className="order-details-summary">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p>
                <strong>Placed:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
              <p><strong>Order status:</strong> {order.status.replaceAll("_", " ")}</p>
              <p><strong>Payment status:</strong> {order.paymentStatus}</p>
              <p>
                <strong>Total:</strong> ₹
                {Number(order.totalAmount).toFixed(2)}
              </p>
            </section>

            <section>
              <h2>Items</h2>

              {order.items.map((item, index) => (
                <article
                  className="order-details-item"
                  key={`${item.product}-${index}`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      width="90"
                      loading="lazy"
                    />
                  )}

                  <div>
                    <h3>{item.name}</h3>
                    <p>Unit price: ₹{Number(item.price).toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Line total: ₹
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <section>
              <h2>Shipping Address</h2>
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
            </section>

            <p>
              <Link to="/products">Continue shopping</Link>
            </p>
          </>
        )}
      </main>
    </>
  );
}

export default OrderDetails;