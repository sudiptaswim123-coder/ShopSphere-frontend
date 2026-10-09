
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  deleteProduct,
  fetchProducts,
  handleProductImageError,
} from "../../services/productService";

function Products() {
  const { token } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.success || "");

  useEffect(() => {
    let isCurrent = true;
    fetchProducts()
      .then((data) => {
        if (isCurrent) {
          setProducts(data.map((product) => ({
            ...product,
            status: Number(product.stock) > 0 ? "Active" : "Draft",
          })));
        }
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Failed to load products.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  /* =================================
     FILTER
  ================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" &&
          product.stock > 0) ||
        (stockFilter === "Out of Stock" &&
          product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    products,
    searchTerm,
    category,
    stockFilter,
  ]);

  /* =================================
     DELETE PRODUCT
  ================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id, token);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
      setSuccess("Product deleted successfully.");
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Failed to delete product.");
      setSuccess("");
    }
  };

  return (
    <div className="admin-page">

      {/* ==============================
          SIDEBAR
      ============================== */}
      <aside className="admin-sidebar admin-products-sidebar">

        <div className="admin-brand">
          <Link to="/" className="admin-logo">

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
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link active"
          >
            <span>Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            <span>Orders</span>
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            <span>Customers</span>
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-view-store"
          >
            View Store
          </Link>

        </div>

      </aside>


      {/* ==============================
          MAIN
      ============================== */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div className="admin-topbar-title">
            <span>ADMINISTRATION</span>

            <h1>
              Product Management
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
                Super Admin
              </span>
            </div>

          </div>

        </header>


        {/* Content */}
        <div className="admin-content">

          {success && <div className="admin-form-success" role="status">{success}</div>}
          {error && (
            <div className="admin-form-error" role="alert">
              {error}
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {/* Header */}
          <div className="admin-products-header">

            <div>
              <span className="small-heading">
                CATALOG
              </span>

              <h2>
                Products
              </h2>

              <p>
                Manage your store products and inventory.
              </p>
            </div>

            <Link
              to="/admin/products/add"
              className="admin-add-product"
            >
              <Plus size={18} />
              Add Product
            </Link>

          </div>


          {/* Stats */}
          <div className="admin-product-mini-stats">

            <div className="admin-product-mini-card">
              <span>Total Products</span>

              <strong>
                {products.length}
              </strong>
            </div>

            <div className="admin-product-mini-card">
              <span>Active Products</span>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.status === "Active"
                  ).length
                }
              </strong>
            </div>

            <div className="admin-product-mini-card">
              <span>Low Stock</span>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.stock > 0 &&
                      product.stock <= 10
                  ).length
                }
              </strong>
            </div>

            <div className="admin-product-mini-card">
              <span>Out of Stock</span>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.stock === 0
                  ).length
                }
              </strong>
            </div>

          </div>


          {/* Toolbar */}
          <div className="admin-products-toolbar">

            <div className="admin-product-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>


            <div className="admin-product-filter">

              <Filter size={16} />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown size={15} />

            </div>


            <div className="admin-product-filter">

              <select
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(e.target.value)
                }
              >
                <option value="All">
                  All Stock
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>

              <ChevronDown size={15} />

            </div>

          </div>


          {/* Product Table */}
          <section className="admin-card admin-products-card">

            <div className="admin-card-header">

              <div>
                <span className="admin-card-eyebrow">
                  INVENTORY
                </span>

                <h3>
                  Product List
                </h3>
              </div>

              <span className="admin-result-count">
                {filteredProducts.length} products
              </span>

            </div>


            {loading ? (
              <div className="admin-products-empty" role="status">
                <div className="loading-spinner" />
                <p>Loading products...</p>
              </div>
            ) : !error && (
            <div className="admin-products-table-wrapper">

              <table className="admin-products-table">

                <thead>
                  <tr>
                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>


                <tbody>

                  {filteredProducts.map(
                    (product) => (
                      <tr key={product.id}>

                        {/* Product */}
                        <td>

                          <div className="admin-product-info">

                            <img
                              src={product.image}
                              alt={product.name}
                              onError={handleProductImageError}
                            />

                            <div>
                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                ID #{product.id}
                              </span>
                            </div>

                          </div>

                        </td>


                        {/* Category */}
                        <td>
                          <span className="admin-category-pill">
                            {product.category}
                          </span>
                        </td>


                        {/* Price */}
                        <td>
                          <strong>
                            ₹
                            {Number(product.price || 0).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>


                        {/* Stock */}
                        <td>

                          <span
                            className={
                              product.stock === 0
                                ? "stock-out"
                                : product.stock <= 10
                                ? "stock-low"
                                : "stock-good"
                            }
                          >
                            {product.stock === 0
                              ? "Out of stock"
                              : `${product.stock} units`}
                          </span>

                        </td>


                        {/* Status */}
                        <td>

                          <span
                            className={
                              product.status ===
                              "Active"
                                ? "admin-product-status active"
                                : "admin-product-status draft"
                            }
                          >
                            {product.status}
                          </span>

                        </td>


                        {/* Actions */}
                        <td>

                          <div className="admin-product-actions">

                            <button
                              type="button"
                              title="View product"
                            >
                              <Eye size={16} />
                            </button>

                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              title="Edit product"
                            >
                              <Edit3 size={16} />
                            </Link>

                            <button
                              type="button"
                              title="Delete product"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>


              {/* Empty State */}

              {filteredProducts.length === 0 && (
                <div className="admin-products-empty">

                  <Search size={28} />

                  <h3>
                    No products found
                  </h3>

                  <p>
                    Try adjusting your search or filters.
                  </p>

                </div>
              )}

            </div>
            )}

          </section>

        </div>
      </main>

    </div>
  );
}

export default Products;

