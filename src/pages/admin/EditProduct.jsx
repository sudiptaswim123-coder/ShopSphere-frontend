
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Image,
  Package,
  Save,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchProductById,
  updateProduct,
} from "../../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [existingProduct, setExistingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    fetchProductById(id)
      .then((product) => {
        if (!isCurrent) return;
        setExistingProduct(product);
        setFormData({
          name: product.name || "",
          category: product.category || "",
          gender: product.gender || "Unisex",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          stock: product.stock ?? "",
          badge: product.badge || "",
          image: product.image || "",
          description: product.description || "",
          featured: Boolean(product.featured),
        });
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Failed to load product.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
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
      formData.stock === "" ||
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

    if (
      Number(formData.oldPrice) <
      Number(formData.price)
    ) {
      setError(
        "Original price should be greater than or equal to selling price."
      );
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        stock: Number(formData.stock),
      }, token);
      navigate("/admin/products", {
        state: { success: "Product updated successfully." },
      });
    } catch (requestError) {
      setError(requestError.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <main className="admin-main admin-main-full">
          <div className="admin-content" role="status">
            <div className="loading-spinner" />
            <p>Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!existingProduct) {
    return (
      <div className="admin-page">
        <main className="admin-main admin-main-full">

          <div className="admin-content">

            <div className="admin-products-empty">
              <h3>
                Product not found
              </h3>

              <p>
                {error || "The product you are trying to edit does not exist."}
              </p>

              {error && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              )}

              <Link
                to="/admin/products"
                className="admin-add-product"
              >
                Back to Products
              </Link>
            </div>

          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* =================================
          SIDEBAR
      ================================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <Link
            to="/"
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


      {/* =================================
          MAIN
      ================================= */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div className="admin-topbar-title">

            <span>
              CATALOG
            </span>

            <h1>
              Edit Product
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


        <div className="admin-content">

          {/* Back */}
          <Link
            to="/admin/products"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>


          {/* Heading */}
          <div className="admin-form-heading">

            <div>

              <span className="small-heading">
                PRODUCT CATALOG
              </span>

              <h2>
                Edit Product
              </h2>

              <p>
                Update the information for this product.
              </p>

            </div>

          </div>


          {/* Form */}
          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            {/* Basic Information */}

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
                    Update the product's main information.
                  </p>

                </div>

              </div>


              <div className="admin-form-grid">

                <div className="admin-field admin-field-full">

                  <label htmlFor="name">
                    Product Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


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


            {/* Pricing */}

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
                    Update pricing and stock details.
                  </p>

                </div>

              </div>


              <div className="admin-form-grid">

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
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


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
                      value={formData.oldPrice}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                <div className="admin-field">

                  <label htmlFor="stock">
                    Stock Quantity *
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />

                </div>


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


            {/* Media */}

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
                    Update the product image.
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
                  value={formData.image}
                  onChange={handleChange}
                  required
                />

              </div>


              {formData.image && (
                <div className="admin-image-preview">

                  <img
                    src={formData.image}
                    alt="Product preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <span>
                    Product Preview
                  </span>

                </div>
              )}

            </section>


            {/* Description */}

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
                    Update the product description.
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
                {saving ? "Saving..." : "Update Product"}
              </button>

            </div>

          </form>

        </div>
      </main>

    </div>
  );
}

export default EditProduct;
