
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { handleProductImageError } from "../services/productService";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setError("Please sign in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await apiRequest("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (requestError) {
        setError(requestError.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const retryLoadOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="orders-page">
      <div className="container">

        {/* HEADER */}
        <div className="orders-header">
          <div>
            <Link
              to="/profile"
              className="orders-back-link"
            >
              <ArrowLeft size={15} />
              Back to Profile
            </Link>

            <span className="small-heading">
              Purchase History
            </span>

            <h1 className="orders-title">
              My Orders
            </h1>

            <p className="orders-subtitle">
              Track and review all your ShopSphere purchases.
            </p>
          </div>

          {!loading && !error && orders.length > 0 && (
            <div className="orders-count">
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </div>
          )}
        </div>


        {/* EMPTY STATE */}
        {loading ? (
          <div className="products-loading" role="status">
            <div className="loading-spinner" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="orders-empty" role="alert">
            <h2>Unable to load orders</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={retryLoadOrders}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              <Package size={32} />
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You have not placed any orders yet.
              Start shopping and your orders will appear here.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Start Shopping
            </Link>

          </div>
        ) : (

          /* ORDERS LIST */
          <div className="orders-list">

            {orders.map((order) => {

              const orderDate = order?.createdAt
                ? new Date(order.createdAt)
                : null;

              const formattedDate =
                orderDate &&
                !Number.isNaN(orderDate.getTime())
                  ? orderDate.toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Date unavailable";

              return (
                <article
                  className="order-card"
                  key={order._id}
                >

                  {/* ORDER TOP */}
                  <div className="order-card-top">

                    <div className="order-card-id">

                      <div className="order-card-icon">
                        <ShoppingBag size={17} />
                      </div>

                      <div>
                        <span>
                          Order ID
                        </span>

                        <strong>
                          #{order._id}
                        </strong>
                      </div>

                    </div>


                    <div className="order-card-status">
                      <span className="order-status">
                        {order.status || "Processing"}
                      </span>
                    </div>

                  </div>


                  {/* ORDER DETAILS */}
                  <div className="order-card-details">

                    <div>
                      <span>Order Date</span>

                      <strong>
                        {formattedDate}
                      </strong>
                    </div>


                    <div>
                      <span>Items</span>

                      <strong>
                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1
                          ? "item"
                          : "items"}
                      </strong>
                    </div>


                    <div>
                      <span>Payment</span>

                      <strong>
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </strong>
                    </div>


                    <div>
                      <span>Total</span>

                      <strong>
                        ₹
                        {Number(
                          order?.total || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                  </div>


                  {/* ORDER PRODUCTS */}
                  <div className="order-products">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          className="order-product"
                          key={`${order._id}-${item.product || index}`}
                        >

                          <div className="order-product-image">
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={handleProductImageError}
                            />
                          </div>


                          <div className="order-product-info">

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              Qty: {item.quantity}
                            </span>

                          </div>


                          <strong className="order-product-price">
                            ₹
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toLocaleString("en-IN")}
                          </strong>

                        </div>
                      )
                    )}

                  </div>


                  {/* ORDER FOOTER */}
                  <div className="order-card-footer">

                    <div>
                      <Package size={15} />

                      <span>
                        Your order is being processed.
                      </span>
                    </div>


                    <button
                      type="button"
                      className="order-details-btn"
                    >
                      Order Details
                      <ChevronRight size={14} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}

export default Orders;
