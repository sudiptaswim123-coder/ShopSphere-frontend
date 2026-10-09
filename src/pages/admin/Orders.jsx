import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";
import { handleProductImageError } from "../../services/productService";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setError("Please sign in with an administrator account.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/orders/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (requestError) {
        setError(
          requestError.message || "Failed to load admin orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/orders/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (requestError) {
      setError(
        requestError.message || "Failed to load admin orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setError("");

    try {
      const data = await apiRequest(
        `/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(data.order);
      }
    } catch (requestError) {
      setError(
        requestError.message || "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId("");
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order?.customer?.name?.toLowerCase() || "";

      const customerEmail =
        order?.customer?.email?.toLowerCase() || "";

      const orderId =
        order?._id?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        orderId.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        order?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const processing = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const shipped = orders.filter(
      (order) => order.status === "Shipped"
    ).length;

    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + Number(order?.total || 0),
      0
    );

    return {
      totalOrders,
      processing,
      shipped,
      delivered,
      totalRevenue,
    };
  }, [orders]);

  const getOrderDate = (createdAt) => {
    if (!createdAt) return "Date unavailable";

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderDateTime = (createdAt) => {
    if (!createdAt) return "Date unavailable";

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "admin-order-status delivered";

      case "Shipped":
        return "admin-order-status shipped";

      case "Processing":
        return "admin-order-status processing";

      default:
        return "admin-order-status pending";
    }
  };

  const getProductId = (item) => {
    if (!item?.product) return "N/A";

    if (typeof item.product === "object") {
      return item.product?._id || "N/A";
    }

    return item.product;
  };

  const getProductDescription = (item) => {
    if (item?.description) {
      return item.description;
    }

    if (
      item?.product &&
      typeof item.product === "object" &&
      item.product?.description
    ) {
      return item.product.description;
    }

    return "No description available.";
  };

  const getProductGender = (item) => {
    if (item?.gender) {
      return item.gender;
    }

    if (
      item?.product &&
      typeof item.product === "object" &&
      item.product?.gender
    ) {
      return item.product.gender;
    }

    return "Unisex";
  };

  const getProductPrice = (item) => {
    if (Number.isFinite(Number(item?.price))) {
      return Number(item.price);
    }

    if (
      item?.product &&
      typeof item.product === "object" &&
      Number.isFinite(Number(item.product?.price))
    ) {
      return Number(item.product.price);
    }

    return 0;
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <Link
            to="/admin"
            className="admin-logo"
          >
            <span className="logo-mark">
              S
            </span>

            <span className="admin-logo-text">
              ShopSphere
            </span>
          </Link>
        </div>

        <div className="admin-panel-label">
          ADMIN PANEL
        </div>

        <nav className="admin-nav">

          <Link
            to="/admin"
            className="admin-nav-link"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link active"
          >
            Orders
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            Customers
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            Customers
          </Link>

          <Link
            to="/products"
            className="admin-nav-link"
          >
            View Store
          </Link>

        </nav>

      </aside>


      {/* MAIN */}
      <main className="admin-main">

        {/* TOPBAR */}
        <div className="admin-topbar">

          <div className="admin-topbar-title">

            <span>
              SHOPSPHERE ADMIN
            </span>

            <h1>
              Orders
            </h1>

          </div>

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div className="admin-user-info">
              <strong>
                Administrator
              </strong>

              <span>
                Store Manager
              </span>
            </div>

          </div>

        </div>


        {/* CONTENT */}
        <div className="admin-content">

          <div className="admin-orders-header">

            <div>
              <Link
                to="/admin"
                className="admin-back-link"
              >
                <ArrowLeft size={14} />
                Dashboard
              </Link>

              <span className="admin-card-eyebrow">
                ORDER MANAGEMENT
              </span>

              <h2>
                Customer Orders
              </h2>

              <p>
                Track, review and manage all customer orders.
              </p>
            </div>

          </div>


          {/* STATS */}
          <div className="admin-order-stats">

            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon">
                <Package size={17} />
              </div>

              <span>Total Orders</span>

              <strong>
                {stats.totalOrders}
              </strong>
            </div>


            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon">
                <Clock3 size={17} />
              </div>

              <span>Processing</span>

              <strong>
                {stats.processing}
              </strong>
            </div>


            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon">
                <Truck size={17} />
              </div>

              <span>Shipped</span>

              <strong>
                {stats.shipped}
              </strong>
            </div>


            <div className="admin-order-stat-card">
              <div className="admin-order-stat-icon">
                <CheckCircle2 size={17} />
              </div>

              <span>Delivered</span>

              <strong>
                {stats.delivered}
              </strong>
            </div>


            <div className="admin-order-stat-card admin-order-revenue">
              <div className="admin-order-stat-icon">
                ₹
              </div>

              <span>Total Revenue</span>

              <strong>
                ₹
                {stats.totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>


          {/* TOOLBAR */}
          <div className="admin-orders-toolbar">

            <div className="admin-order-search">

              <Search size={16} />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by order ID, customer or email..."
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}

            </div>


            <div className="admin-order-filter">

              <Filter size={15} />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

            </div>

          </div>


          {/* TABLE */}
          <div className="admin-card admin-orders-card">

            <div className="admin-card-header">

              <div>
                <span className="admin-card-eyebrow">
                  ORDERS
                </span>

                <h3>
                  Order List
                </h3>
              </div>

              <span className="admin-result-count">
                {filteredOrders.length} results
              </span>

            </div>


            {error && (
              <div className="products-error" role="alert">
                <p>{error}</p>

                <button
                  className="btn btn-primary"
                  onClick={loadOrders}
                >
                  Retry
                </button>
              </div>
            )}


            {loading ? (
              <div
                className="admin-orders-empty"
                role="status"
              >
                <div className="loading-spinner" />

                <p>
                  Loading orders...
                </p>
              </div>
            ) : !error && filteredOrders.length === 0 ? (
              <div className="admin-orders-empty">

                <Package size={30} />

                <h3>
                  No Orders Found
                </h3>

                <p>
                  There are no orders matching your current filters.
                </p>

              </div>
            ) : !error && (

              <div className="admin-orders-table-wrapper">

                <table className="admin-orders-table">

                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>CUSTOMER</th>
                      <th>DATE</th>
                      <th>ITEMS</th>
                      <th>PAYMENT</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredOrders.map((order) => (

                      <tr key={order._id}>

                        {/* ORDER */}
                        <td>
                          <strong className="admin-order-id">
                            #{order._id}
                          </strong>
                        </td>


                        {/* CUSTOMER */}
                        <td>
                          <div className="admin-order-customer">

                            <div className="admin-order-customer-avatar">
                              {(order?.customer?.name || order?.user?.name)
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            <div>
                              <strong>
                                {order?.customer?.name ||
                                  order?.user?.name ||
                                  "Guest User"}
                              </strong>

                              <span>
                                {order?.customer?.email ||
                                  order?.user?.email ||
                                  "No email"}
                              </span>
                            </div>

                          </div>
                        </td>


                        {/* DATE */}
                        <td>
                          {getOrderDate(
                            order.createdAt
                          )}
                        </td>


                        {/* ITEMS */}
                        <td>
                          <span className="admin-order-items-count">
                            {order.items?.length || 0}{" "}
                            {order.items?.length === 1
                              ? "item"
                              : "items"}
                          </span>
                        </td>


                        {/* PAYMENT */}
                        <td>
                          <span className="admin-payment-method">
                            {order.paymentMethod === "cod"
                              ? "COD"
                              : "Online"}
                          </span>
                        </td>


                        {/* TOTAL */}
                        <td>
                          <strong>
                            ₹
                            {Number(
                              order?.total || 0
                            ).toLocaleString("en-IN")}
                          </strong>
                        </td>


                        {/* STATUS */}
                        <td>
                          <select
                            className={getStatusClass(
                              order.status
                            )}
                            disabled={
                              updatingOrderId === order._id
                            }
                            value={
                              order.status ||
                              "Processing"
                            }
                            onChange={(event) =>
                              updateOrderStatus(
                                order._id,
                                event.target.value
                              )
                            }
                          >
                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>
                          </select>
                        </td>


                        {/* ACTION */}
                        <td>
                          <div className="admin-order-actions">

                            <button
                              type="button"
                              title="View order details"
                              aria-label={`View order ${order._id}`}
                              onClick={() =>
                                openOrderDetails(order)
                              }
                            >
                              <Eye size={15} />
                            </button>

                          </div>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>


      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeOrderDetails();
            }
          }}
        >
          <div
            className="admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-details-title"
          >

            {/* MODAL HEADER */}
            <div className="admin-order-modal-header">

              <div>
                <span className="admin-card-eyebrow">
                  ORDER DETAILS
                </span>

                <h2 id="admin-order-details-title">
                  Order #{selectedOrder._id}
                </h2>

                <p>
                  Placed on{" "}
                  {getOrderDateTime(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                type="button"
                className="admin-order-modal-close"
                onClick={closeOrderDetails}
                aria-label="Close order details"
              >
                <X size={20} />
              </button>

            </div>


            {/* ORDER STATUS */}
            <div className="admin-order-modal-status-row">

              <div>
                <span className="admin-order-detail-label">
                  ORDER STATUS
                </span>

                <select
                  className={getStatusClass(
                    selectedOrder.status
                  )}
                  disabled={
                    updatingOrderId === selectedOrder._id
                  }
                  value={
                    selectedOrder.status ||
                    "Processing"
                  }
                  onChange={(event) =>
                    updateOrderStatus(
                      selectedOrder._id,
                      event.target.value
                    )
                  }
                >
                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="admin-order-modal-payment">
                <span className="admin-order-detail-label">
                  PAYMENT
                </span>

                <strong>
                  {selectedOrder.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>
              </div>

            </div>


            {/* CUSTOMER INFORMATION */}
            <div className="admin-order-detail-section">

              <div className="admin-order-detail-section-header">
                <h3>
                  Customer Information
                </h3>
              </div>

              <div className="admin-order-detail-grid">

                <div className="admin-order-detail-field">
                  <span>
                    Customer Name
                  </span>

                  <strong>
                    {selectedOrder?.customer?.name ||
                      selectedOrder?.user?.name ||
                      "Guest User"}
                  </strong>
                </div>

                <div className="admin-order-detail-field">
                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedOrder?.customer?.email ||
                      selectedOrder?.user?.email ||
                      "No email"}
                  </strong>
                </div>

                <div className="admin-order-detail-field">
                  <span>
                    Phone
                  </span>

                  <strong>
                    {selectedOrder?.customer?.phone ||
                      selectedOrder?.deliveryAddress?.phone ||
                      "No phone"}
                  </strong>
                </div>

              </div>

            </div>


            {/* DELIVERY ADDRESS */}
            <div className="admin-order-detail-section">

              <div className="admin-order-detail-section-header">
                <h3>
                  Delivery Address
                </h3>
              </div>

              <div className="admin-order-address">

                <strong>
                  {selectedOrder?.deliveryAddress?.fullName ||
                    selectedOrder?.customer?.name ||
                    "Customer"}
                </strong>

                <p>
                  {selectedOrder?.deliveryAddress?.address ||
                    "Address unavailable"}
                </p>

                {selectedOrder?.deliveryAddress?.landmark && (
                  <p>
                    Landmark:{" "}
                    {selectedOrder.deliveryAddress.landmark}
                  </p>
                )}

                <p>
                  {selectedOrder?.deliveryAddress?.city || ""}
                  {selectedOrder?.deliveryAddress?.city &&
                  selectedOrder?.deliveryAddress?.state
                    ? ", "
                    : ""}
                  {selectedOrder?.deliveryAddress?.state || ""}
                  {selectedOrder?.deliveryAddress?.pincode
                    ? ` - ${selectedOrder.deliveryAddress.pincode}`
                    : ""}
                </p>

                <p>
                  Phone:{" "}
                  {selectedOrder?.deliveryAddress?.phone ||
                    selectedOrder?.customer?.phone ||
                    "No phone"}
                </p>

              </div>

            </div>


            {/* PRODUCTS */}
            <div className="admin-order-detail-section">

              <div className="admin-order-detail-section-header">

                <h3>
                  Products
                </h3>

                <span>
                  {selectedOrder.items?.length || 0}{" "}
                  {selectedOrder.items?.length === 1
                    ? "item"
                    : "items"}
                </span>

              </div>


              <div className="admin-order-detail-products">

                {selectedOrder.items?.map(
                  (item, index) => {
                    const productId =
                      getProductId(item);

                    const description =
                      getProductDescription(item);

                    const gender =
                      getProductGender(item);

                    const unitPrice =
                      getProductPrice(item);

                    const quantity =
                      Number(item?.quantity || 1);

                    const itemSubtotal =
                      unitPrice * quantity;

                    return (
                      <div
                        className="admin-order-detail-product"
                        key={`${selectedOrder._id}-${productId}-${index}`}
                      >

                        {/* IMAGE */}
                        <div className="admin-order-detail-product-image">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item?.name || "Product"}
                              onError={
                                handleProductImageError
                              }
                            />
                          ) : (
                            <Package size={28} />
                          )}
                        </div>


                        {/* PRODUCT INFORMATION */}
                        <div className="admin-order-detail-product-content">

                          <div className="admin-order-detail-product-main">

                            <div>
                              <h4>
                                {item?.name ||
                                  "Unnamed Product"}
                              </h4>

                              <span className="admin-order-detail-product-id">
                                Product ID:{" "}
                                {productId}
                              </span>
                            </div>

                            <strong className="admin-order-detail-product-total">
                              ₹
                              {itemSubtotal.toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>


                          <p className="admin-order-detail-description">
                            {description}
                          </p>


                          <div className="admin-order-detail-product-meta">

                            <span>
                              <strong>
                                Gender:
                              </strong>{" "}
                              {gender}
                            </span>

                            <span>
                              <strong>
                                Quantity:
                              </strong>{" "}
                              {quantity}
                            </span>

                            <span>
                              <strong>
                                Unit Price:
                              </strong>{" "}
                              ₹
                              {unitPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span>
                              <strong>
                                Subtotal:
                              </strong>{" "}
                              ₹
                              {itemSubtotal.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>


            {/* ORDER SUMMARY */}
            <div className="admin-order-detail-section">

              <div className="admin-order-detail-section-header">
                <h3>
                  Order Summary
                </h3>
              </div>

              <div className="admin-order-summary">

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder?.subtotal || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>
                    Shipping
                  </span>

                  <strong>
                    {Number(
                      selectedOrder?.shipping || 0
                    ) === 0
                      ? "FREE"
                      : `₹${Number(
                          selectedOrder.shipping
                        ).toLocaleString("en-IN")}`}
                  </strong>
                </div>

                <div>
                  <span>
                    Tax
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder?.tax || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="admin-order-summary-total">
                  <span>
                    Grand Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder?.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}
            <div className="admin-order-modal-footer">

              <button
                type="button"
                className="btn btn-primary"
                onClick={closeOrderDetails}
              >
                Close Details
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;