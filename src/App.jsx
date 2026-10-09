
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  fetchProducts,
  handleProductImageError,
} from "./services/productService";


/* ==============================
   HOME PAGE
================================ */
function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  /* ==============================
     FETCH FEATURED PRODUCTS
  ============================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const data = await fetchProducts();

        const allProducts = Array.isArray(data) ? data : [];
        setProducts(allProducts);

        const featured = allProducts.filter(
          (product) => product.featured
        );

        setFeaturedProducts(featured);
      } catch (error) {
        console.error(
          "Featured products error:",
          error
        );

        setProductsError(
          error.message ||
            "Failed to load featured products."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [...new Set(
    products
      .map((product) => product.category?.trim())
      .filter(Boolean)
  )];

  return (
    <>
      {/* ==============================
          HERO SECTION
      ============================== */}
      <section className="hero-section">
        <div className="container hero-content">

          <div className="hero-text">

            <span className="hero-label">
              NEW SEASON 2026
            </span>

            <h1>
              Style for
              <span> Everyone</span>
            </h1>

            <p>
              Modern essentials for men, women and kids —
              thoughtfully selected for every generation.
            </p>

            <div className="hero-gender-links">
              <Link to="/products?gender=Male">Men</Link>
              <span>|</span>
              <Link to="/products?gender=Female">Women</Link>
              <span>|</span>
              <Link to="/products?gender=Kids">Kids</Link>
            </div>

            <div className="hero-actions">

              <Link
                to="/products"
                className="btn btn-primary"
              >
                Shop Now
              </Link>

              <a
                href="#new-arrivals"
                className="btn btn-outline"
              >
                Explore Collections
              </a>

            </div>
          </div>


          <div className="hero-image">

            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
              alt="ShopSphere collection"
            />

          </div>

        </div>
      </section>


      {/* ==============================
          CATEGORY SECTION
      ============================== */}
      <section
        className="section"
        id="categories"
      >
        <div className="container">

          <div className="section-heading">

            <span className="small-heading">
              SHOP BY CATEGORY
            </span>

            <h2 className="section-title">
              Explore Collections
            </h2>

            <p className="section-subtitle">
              Find something that fits your style.
            </p>

          </div>


          <div className="category-grid">
            {categories.length > 0 ? categories.map((category) => {
              const categoryProduct = products.find(
                (product) => product.category?.trim() === category
              );

              return (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="category-card"
                >
                  <img
                    src={categoryProduct?.image}
                    alt={category}
                    loading="lazy"
                    onError={handleProductImageError}
                  />
                  <div className="category-overlay">
                    <h3>{category}</h3>
                    <span>Explore Now →</span>
                  </div>
                </Link>
              );
            }) : (
              <div className="empty-products">
                <p>{loadingProducts ? "Loading categories..." : "No categories available."}</p>
                {!loadingProducts && (
                  <Link to="/products" className="btn btn-primary">Browse Products</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ==============================
          FEATURED PRODUCTS
      ============================== */}
      <section
        className="section featured-section"
        id="new-arrivals"
      >
        <div className="container">

          <div className="section-top">

            <div>

              <span className="small-heading">
                CURATED FOR YOU
              </span>

              <h2 className="section-title">
                Featured Products
              </h2>

              <p className="section-subtitle">
                Trending products picked specially for
                you.
              </p>

            </div>


            <Link
              to="/products"
              className="view-all"
            >
              View All Products →
            </Link>

          </div>


          {/* ==============================
              PRODUCTS
          ============================== */}
          {loadingProducts ? (
            <div className="products-loading">

              <div className="loading-spinner" />

              <p>
                Loading featured products...
              </p>

            </div>
          ) : productsError ? (
            <div className="products-error">

              <h2>
                Unable to load products
              </h2>

              <p>
                {productsError}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-products">

              <h2>
                No featured products
              </h2>

              <p>
                Featured products will appear here.
              </p>

              <Link
                to="/products"
                className="btn btn-primary"
              >
                Browse Products
              </Link>

            </div>
          ) : (
            <div className="product-grid">

              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

        </div>
      </section>
    </>
  );
}

function NotFound() {
  return (
    <section className="section">
      <div className="container empty-products">
        <h1>Page not found</h1>
        <p>The page you requested is unavailable.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    </section>
  );
}


/* ==============================
   MAIN APP
================================ */
function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* ALL PRODUCTS */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* PRODUCT DETAILS */}
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* CART */}
          <Route
            path="/cart"
            element={<Cart />}
          />
          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/admin"
            element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/products"
            element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>}
          />
          <Route
            path="/admin/products/add"
            element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>}
          />
          <Route
            path="/admin/products/edit/:id"
            element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>}
          />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route
            path="/admin/orders"
            element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers"
            element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
