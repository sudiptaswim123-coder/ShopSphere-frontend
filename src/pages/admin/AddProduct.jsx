
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Image,
  Package,
  Save,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createProduct } from "../../services/productService";

function AddProduct() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "Unisex",
    price: "",
    oldPrice: "",
    stock: "",
    badge: "",
    image: "",
    description: "",
    featured: false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.gender ||
      !formData.price ||
      !formData.oldPrice ||
      !formData.stock ||
      !formData.image.trim()
    ) {
      setError(
        "Please fill in all required product fields."
      );
      return;
    }

    if (
      Number(formData.price) < 0 ||
      Number(formData.oldPrice) < 0
    ) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        stock: Number(formData.stock),
      }, token);
      navigate("/admin/products", {
        state: { success: "Product created successfully." },
      });
    } catch (requestError) {
      setError(requestError.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">

      {/* ==============================
          SIDEBAR
      ============================== */}
      <aside className="admin-sidebar">

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
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link active"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            Orders
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            Customers
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

            <span>
              CATALOG
            </span>

            <h1>
              Add Product
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

          {/* Back */}
          <Link
            to="/admin/products"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>


          {/* Page Heading */}
          <div className="admin-form-heading">

            <div>

              <span className="small-heading">
                PRODUCT CATALOG
              </span>

              <h2>
                Create New Product
              </h2>

              <p>
                Add a new product to your ShopSphere catalog.
              </p>

            </div>

          </div>


          {/* Form */}
          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            {/* ==============================
                BASIC INFORMATION
            ============================== */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-form-card-icon">
                  <Package size={18} />
                </div>

                <div>

                  <h3>
                    Basic Information
                  </h3>

                  <p>
                    Enter the primary details of your product.
                  </p>

                </div>

              </div>


              <div className="admin-form-grid">

                {/* Product Name */}
                <div className="admin-field admin-field-full">

                  <label htmlFor="name">
                    Product Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Premium Cotton Shirt"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Category */}
                <div className="admin-field">

                  <label htmlFor="category">
                    Category *
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Fashion">
                      Fashion
                    </option>

                    <option value="Footwear">
                      Footwear
                    </option>

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Home & Living">
                      Home & Living
                    </option>

                    <option value="Accessories">
                      Accessories
                    </option>
                  </select>

                </div>


                {/* Gender */}
                <div className="admin-field">

                  <label htmlFor="gender">
                    Gender *
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>

                </div>


                {/* Badge */}
                <div className="admin-field">

                  <label htmlFor="badge">
                    Badge
                  </label>

                  <select
                    id="badge"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                  >
                    <option value="">
                      No Badge
                    </option>

                    <option value="NEW">
                      NEW
                    </option>

                    <option value="BESTSELLER">
                      BESTSELLER
                    </option>

                    <option value="POPULAR">
                      POPULAR
                    </option>

                    <option value="SALE">
                      SALE
                    </option>
                  </select>

                </div>

              </div>

            </section>


            {/* ==============================
                PRICING & INVENTORY
            ============================== */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-form-card-icon">
                  ₹
                </div>

                <div>

                  <h3>
                    Pricing & Inventory
                  </h3>

                  <p>
                    Set pricing and available stock.
                  </p>

                </div>

              </div>


              <div className="admin-form-grid">

                {/* Price */}
                <div className="admin-field">

                  <label htmlFor="price">
                    Selling Price *
                  </label>

                  <div className="admin-input-prefix">
                    <span>₹</span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="1499"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>


                {/* Old Price */}
                <div className="admin-field">

                  <label htmlFor="oldPrice">
                    Original Price *
                  </label>

                  <div className="admin-input-prefix">
                    <span>₹</span>

                    <input
                      id="oldPrice"
                      name="oldPrice"
                      type="number"
                      min="0"
                      placeholder="1999"
                      value={formData.oldPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>


                {/* Stock */}
                <div className="admin-field">

                  <label htmlFor="stock">
                    Stock Quantity *
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Featured */}
                <div className="admin-field">

                  <label>
                    Product Visibility
                  </label>

                  <label className="admin-toggle-row">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />

                    <span>
                      Show as Featured Product
                    </span>

                  </label>

                </div>

              </div>

            </section>


            {/* ==============================
                MEDIA
            ============================== */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-form-card-icon">
                  <Image size={18} />
                </div>

                <div>

                  <h3>
                    Product Image
                  </h3>

                  <p>
                    Add the product image URL.
                  </p>

                </div>

              </div>


              <div className="admin-field">

                <label htmlFor="image">
                  Image URL *
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Image Preview */}
              {formData.image && (
                <div className="admin-image-preview">

                  <img
                    src={formData.image}
                    alt="Product preview"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <span>
                    Product Preview
                  </span>

                </div>
              )}

            </section>


            {/* ==============================
                DESCRIPTION
            ============================== */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-form-card-icon">
                  Aa
                </div>

                <div>

                  <h3>
                    Description
                  </h3>

                  <p>
                    Write a clear product description.
                  </p>

                </div>

              </div>


              <div className="admin-field">

                <label htmlFor="description">
                  Product Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Describe the product, its features, materials and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                />

              </div>

            </section>


            {/* Error */}
            {error && (
              <div className="admin-form-error">
                {error}
              </div>
            )}


            {/* Actions */}
            <div className="admin-form-actions">

              <Link
                to="/admin/products"
                className="admin-cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-save-btn"
                disabled={saving}
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Product"}
              </button>

            </div>

          </form>

        </div>
      </main>

    </div>
  );
}

export default AddProduct;
