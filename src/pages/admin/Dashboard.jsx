
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      apiRequest("/orders/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest("/products"),
      apiRequest("/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([orderData, productData, userData]) => {
        if (!isCurrent) return;
        setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
        setProducts(Array.isArray(productData.products) ? productData.products : []);
        setUsers(Array.isArray(userData.users) ? userData.users : []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Failed to load dashboard data.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const regularCustomers = users.filter((account) => account.role !== "admin").length;
  const processingOrders = orders.filter((order) => order.status === "Processing").length;
  const inStockProducts = products.filter((product) => Number(product.stock) > 0).length;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      detail: "Excludes cancelled orders",
      icon: CircleDollarSign,
    },
    {
      title: "Total Orders",
      value: orders.length.toLocaleString("en-IN"),
      detail: `${processingOrders} processing`,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: products.length.toLocaleString("en-IN"),
      detail: `${inStockProducts} in stock`,
      icon: Package,
    },
    {
      title: "Customers",
      value: regularCustomers.toLocaleString("en-IN"),
      detail: "Registered accounts",
      icon: Users,
    },
  ];

  const recentOrders = orders.slice(0, 4);
  const productById = new Map(
    products.map((product) => [String(product._id || product.id), product])
  );
  const productSales = new Map();
  orders
    .filter((order) => order.status !== "Cancelled")
    .forEach((order) => {
      order.items?.forEach((item) => {
        const productId = String(item.product || item._id || item.name);
        const product = productById.get(productId);
        const current = productSales.get(productId) || {
          id: productId,
          name: item.name || product?.name || "Product",
          category: product?.category || "Product",
          sales: 0,
        };
        current.sales += Number(item.quantity || 0);
        productSales.set(productId, current);
      });
    });
  const topProducts = [...productSales.values()]
    .sort((first, second) => second.sales - first.sales)
    .slice(0, 4);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatOrderDate = (createdAt) => {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status delivered";

      case "Processing":
        return "status processing";

      case "Shipped":
        return "status shipped";

      case "Pending":
        return "status pending";

      default:
        return "status";
    }
  };

  return (
    <div className="admin-page">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==============================
          SIDEBAR
      ============================== */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-brand">

          <Link to="/" className="admin-logo">
            <span className="logo-mark">S</span>

            <span className="admin-logo-text">
              ShopSphere
            </span>
          </Link>

          <button
            className="admin-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-panel-label">
          ADMIN PANEL
        </div>

        <nav className="admin-nav">

          <Link
            to="/admin"
            className="admin-nav-link active"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
            onClick={() => setSidebarOpen(false)}
          >
            <Boxes size={18} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
            onClick={() => setSidebarOpen(false)}
          >
            <ShoppingCart size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={18} />
            <span>Customers</span>
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-view-store"
          >
            <ChevronRight size={17} />
            View Store
          </Link>

          <button
            className="admin-logout"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </aside>

      {/* ==============================
          MAIN AREA
      ============================== */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="admin-topbar-title">
            <span>ADMINISTRATION</span>
            <h1>Dashboard</h1>
          </div>

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div className="admin-user-info">
              <strong>{user?.name || "Administrator"}</strong>
              <span>Super Admin</span>
            </div>

          </div>

        </header>

        {/* Dashboard Content */}
        <div className="admin-content">

          {error && (
            <div className="admin-form-error" role="alert">
              {error}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Welcome */}
          <div className="admin-welcome">

            <div>
              <span className="small-heading">
                SHOPSPHERE OVERVIEW
              </span>

              <h2>
                Welcome, {user?.name || "Admin"}.
              </h2>

              <p>
                Here's what's happening with your store today.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="admin-primary-action"
            >
              <ShoppingCart size={17} />
              Review Orders
            </Link>

          </div>

          {/* ==============================
              STATS
          ============================== */}
          <div className="admin-stats">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="admin-stat-card"
                  key={stat.title}
                >
                  <div className="admin-stat-top">

                    <div className="admin-stat-icon">
                      <Icon size={20} />
                    </div>

                    <span className="stat-change">{stat.detail}</span>

                  </div>

                  <span className="admin-stat-label">
                    {stat.title}
                  </span>

                  <strong className="admin-stat-value">
                    {loading ? "—" : stat.value}
                  </strong>
                </div>
              );
            })}

          </div>

          {/* ==============================
              ORDERS + TOP PRODUCTS
          ============================== */}
          <div className="admin-grid-two">

            {/* Recent Orders */}
            <section className="admin-card">

              <div className="admin-card-header">

                <div>
                  <span className="admin-card-eyebrow">
                    ORDERS
                  </span>

                  <h3>
                    Recent Orders
                  </h3>
                </div>

                <Link to="/admin/orders">
                  View All
                </Link>

              </div>

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {loading ? (
                      <tr><td colSpan="4">Loading orders...</td></tr>
                    ) : error ? (
                      <tr><td colSpan="4">Orders are unavailable.</td></tr>
                    ) : recentOrders.length === 0 ? (
                      <tr><td colSpan="4">No orders have been placed.</td></tr>
                    ) : recentOrders.map((order) => (
                      <tr key={order._id}>

                        <td>
                          <strong>
                            #{order._id}
                          </strong>

                          <span className="table-date">
                            {formatOrderDate(order.createdAt)}
                          </span>
                        </td>

                        <td>
                          {order.customer?.name || order.user?.name || "Customer"}
                        </td>

                        <td>
                          <strong>
                            ₹{Number(order.total || 0).toLocaleString("en-IN")}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              order.status
                            )}
                          >
                            {order.status}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </section>

            {/* Top Products */}
            <section className="admin-card">

              <div className="admin-card-header">

                <div>
                  <span className="admin-card-eyebrow">
                    PERFORMANCE
                  </span>

                  <h3>
                    Top Products
                  </h3>
                </div>

                <Link to="/admin/products">
                  Manage
                </Link>

              </div>

              <div className="top-products-list">

                {loading ? (
                  <p>Loading product sales...</p>
                ) : error ? (
                  <p>Product sales are unavailable.</p>
                ) : topProducts.length === 0 ? (
                  <p>No product sales yet.</p>
                ) : topProducts.map((product, index) => (
                  <div
                    className="top-product"
                    key={product.id}
                  >

                    <div className="top-product-number">
                      {index + 1}
                    </div>

                    <div className="top-product-info">

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.category}
                      </span>

                    </div>

                    <div className="top-product-sales">

                      <strong>
                        {product.sales}
                      </strong>

                      <span>
                        sold
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            </section>

          </div>

          {/* ==============================
              QUICK ACTIONS
          ============================== */}
          <section className="admin-card quick-actions-card">

            <div className="admin-card-header">

              <div>
                <span className="admin-card-eyebrow">
                  MANAGEMENT
                </span>

                <h3>
                  Quick Actions
                </h3>
              </div>

            </div>

            <div className="quick-actions">

              <Link
                to="/admin/products"
                className="quick-action"
              >
                <div className="quick-action-icon">
                  <Package size={20} />
                </div>

                <div>
                  <strong>
                    Manage Products
                  </strong>

                  <span>
                    Add, edit or remove products
                  </span>
                </div>

                <ChevronRight size={18} />
              </Link>

              <Link
                to="/admin/orders"
                className="quick-action"
              >
                <div className="quick-action-icon">
                  <ShoppingCart size={20} />
                </div>

                <div>
                  <strong>
                    Manage Orders
                  </strong>

                  <span>
                    Review and update orders
                  </span>
                </div>

                <ChevronRight size={18} />
              </Link>

              <Link
                to="/admin/customers"
                className="quick-action"
              >
                <div className="quick-action-icon">
                  <UserRound size={20} />
                </div>

                <div>
                  <strong>
                    View Customers
                  </strong>

                  <span>
                    Manage registered customers
                  </span>
                </div>

                <ChevronRight size={18} />
              </Link>

            </div>

          </section>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;
