import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Filter,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

function Customers() {
  const { token, user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    if (!token) {
      setError("Please sign in with an administrator account.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(Array.isArray(data.users) ? data.users : []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [token]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesQuery =
        !query ||
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query);
      const matchesRole =
        roleFilter === "All" || customer.role === roleFilter;

      return matchesQuery && matchesRole;
    });
  }, [customers, roleFilter, searchQuery]);

  const regularCustomers = customers.filter(
    (customer) => customer.role !== "admin"
  ).length;
  const administrators = customers.length - regularCustomers;

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/admin" className="admin-logo">
            <span className="logo-mark">S</span>
            <span className="admin-logo-text">ShopSphere</span>
          </Link>
        </div>

        <div className="admin-panel-label">ADMIN PANEL</div>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Products</Link>
          <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
          <Link to="/admin/customers" className="admin-nav-link active">Customers</Link>
          <Link to="/products" className="admin-nav-link">View Store</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>SHOPSPHERE ADMIN</span>
            <h1>Customers</h1>
          </div>

          <div className="admin-user">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="admin-user-info">
              <strong>{user?.name || "Administrator"}</strong>
              <span>Store Manager</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-orders-header">
            <div>
              <Link to="/admin" className="admin-back-link">
                <ArrowLeft size={14} />
                Dashboard
              </Link>
              <span className="admin-card-eyebrow">CUSTOMER MANAGEMENT</span>
              <h2>Customer Accounts</h2>
              <p>Review registered customers and account details.</p>
            </div>
          </div>

          <div className="admin-order-stats">
            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon"><Users size={17} /></div>
              <span>Total accounts</span>
              <strong>{customers.length}</strong>
            </div>
            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon"><Users size={17} /></div>
              <span>Customers</span>
              <strong>{regularCustomers}</strong>
            </div>
            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon"><ShieldCheck size={17} /></div>
              <span>Administrators</span>
              <strong>{administrators}</strong>
            </div>
          </div>

          <div className="admin-orders-toolbar">
            <div className="admin-order-search">
              <Search size={16} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name or email..."
                aria-label="Search customers"
              />
            </div>

            <div className="admin-order-filter">
              <Filter size={15} />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter by role"
              >
                <option value="All">All roles</option>
                <option value="user">Customers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div className="admin-card admin-orders-card">
            <div className="admin-card-header">
              <div>
                <span className="admin-card-eyebrow">ACCOUNTS</span>
                <h3>Registered customers</h3>
              </div>
              <span className="admin-result-count">
                {filteredCustomers.length} results
              </span>
            </div>

            {loading ? (
              <div className="admin-orders-empty" role="status">
                <div className="loading-spinner" />
                <p>Loading customer accounts...</p>
              </div>
            ) : error ? (
              <div className="admin-orders-empty" role="alert">
                <h3>Unable to load customers</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={loadCustomers}>
                  Retry
                </button>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="admin-orders-empty">
                <Users size={30} />
                <h3>No customers found</h3>
                <p>
                  {customers.length
                    ? "No accounts match your search or role filter."
                    : "Registered accounts will appear here."}
                </p>
              </div>
            ) : (
              <div className="admin-orders-table-wrapper">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                      <th>REGISTERED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer._id || customer.id}>
                        <td>
                          <div className="admin-order-customer">
                            <div className="admin-order-customer-avatar">
                              {customer.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <strong>{customer.name || "Unnamed customer"}</strong>
                          </div>
                        </td>
                        <td>{customer.email || "No email"}</td>
                        <td>
                          <span className={`admin-order-status ${customer.role === "admin" ? "shipped" : "processing"}`}>
                            {customer.role === "admin" ? "Administrator" : "Customer"}
                          </span>
                        </td>
                        <td>{formatDate(customer.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Customers;
