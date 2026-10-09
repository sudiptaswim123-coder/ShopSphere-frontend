
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Package,
  ShoppingBag,
  Heart,
  ArrowRight,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { apiRequest } from "../services/api";

function Profile() {
  const { user, token, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setOrdersError("Please sign in to view your orders.");
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError("");
        const data = await apiRequest("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (requestError) {
        setOrdersError(requestError.message || "Failed to load your orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const retryLoadOrders = async () => {
    if (!token) return;
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const data = await apiRequest("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (requestError) {
      setOrdersError(requestError.message || "Failed to load your orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="profile-page">
        <div className="container">
          <div className="profile-login-state">
            <div className="profile-empty-icon">
              <UserRound size={30} />
            </div>

            <h1>Sign in to view your profile</h1>

            <p>
              Please sign in to access your account details,
              orders and wishlist.
            </p>

            <Link
              to="/login"
              className="btn btn-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const totalSpent = orders.reduce(
    (total, order) =>
      total + Number(order?.total || 0),
    0
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
  };

  return (
    <section className="profile-page">
      <div className="container">

        {/* HEADER */}
        <div className="profile-header">
          <span className="small-heading">
            My Account
          </span>

          <h1 className="profile-title">
            Welcome back, {user?.name || "User"}
          </h1>

          <p className="profile-subtitle">
            Manage your account and keep track of your ShopSphere orders.
          </p>
        </div>


        {/* MAIN GRID */}
        <div className="profile-layout">

          {/* LEFT */}
          <div className="profile-main">

            {/* PROFILE CARD */}
            <div className="profile-card">

              <div className="profile-card-header">
                <div>
                  <span className="profile-card-eyebrow">
                    Account Information
                  </span>

                  <h2>
                    Personal Details
                  </h2>
                </div>
              </div>


              <div className="profile-user">
                <div className="profile-avatar">
                  {initials}
                </div>

                <div className="profile-user-info">
                  <h3>
                    {user?.name || "ShopSphere User"}
                  </h3>

                  <span>
                    {user?.email || "No email available"}
                  </span>
                </div>
              </div>


              <div className="profile-details-list">

                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <UserRound size={16} />
                  </div>

                  <div>
                    <span>Full Name</span>
                    <strong>
                      {user?.name || "Not available"}
                    </strong>
                  </div>
                </div>


                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <Mail size={16} />
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>
                      {user?.email || "Not available"}
                    </strong>
                  </div>
                </div>


                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <Phone size={16} />
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      Phone number can be added during checkout.
                    </strong>
                  </div>
                </div>

              </div>

            </div>


            {/* RECENT ORDERS */}
            <div className="profile-card">

              <div className="profile-card-header">
                <div>
                  <span className="profile-card-eyebrow">
                    Purchase History
                  </span>

                  <h2>
                    Recent Orders
                  </h2>
                </div>

                <Link
                  to="/orders"
                  className="profile-view-all"
                >
                  View All
                  <ArrowRight size={13} />
                </Link>
              </div>


              {ordersLoading ? (
                <div className="profile-no-orders" role="status">
                  <div className="loading-spinner" />
                  <p>Loading recent orders...</p>
                </div>
              ) : ordersError ? (
                <div className="profile-no-orders" role="alert">
                  <h3>Unable to load orders</h3>
                  <p>{ordersError}</p>
                  <button className="btn btn-primary" onClick={retryLoadOrders}>
                    Retry
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="profile-no-orders">
                  <Package size={28} />

                  <h3>
                    No orders yet
                  </h3>

                  <p>
                    Your completed orders will appear here.
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="profile-order-list">

                  {orders.slice(0, 3).map((order) => (
                    <div
                      className="profile-order-row"
                      key={order._id}
                    >

                      <div className="profile-order-icon">
                        <ShoppingBag size={17} />
                      </div>

                      <div className="profile-order-info">
                        <strong>
                          #{order._id}
                        </strong>

                        <span>
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "item"
                            : "items"}
                        </span>
                      </div>

                      <div className="profile-order-meta">
                        <strong>
                          ₹
                          {Number(
                            order?.total || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                        <span className="profile-order-status">
                          {order.status || "Processing"}
                        </span>
                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>


          {/* RIGHT SIDEBAR */}
          <aside className="profile-sidebar">

            {/* SUMMARY */}
            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                <Package size={18} />
              </div>

              <span>
                Total Orders
              </span>

              <strong>
                {orders.length}
              </strong>

            </div>


            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                <ShoppingBag size={18} />
              </div>

              <span>
                Total Spent
              </span>

              <strong>
                ₹
                {totalSpent.toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                <Heart size={18} />
              </div>

              <span>
                Wishlist Items
              </span>

              <strong>
                {wishlistCount}
              </strong>

            </div>


            {/* ACCOUNT ACTIONS */}
            <div className="profile-actions-card">

              <span className="profile-card-eyebrow">
                Quick Access
              </span>

              <Link to="/orders">
                <Package size={16} />
                My Orders
                <ArrowRight size={13} />
              </Link>

              <Link to="/wishlist">
                <Heart size={16} />
                My Wishlist
                <ArrowRight size={13} />
              </Link>

              <Link to="/products">
                <ShoppingBag size={16} />
                Continue Shopping
                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>

          </aside>

        </div>

      </div>
    </section>
  );
}

export default Profile;
