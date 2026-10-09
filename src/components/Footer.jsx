
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="container">

        {/* =========================
            FOOTER MAIN
        ========================= */}
        <div className="site-footer-main">

          {/* BRAND */}
          <div className="site-footer-brand-column">

            <Link
              to="/"
              className="site-footer-brand"
            >
              <span className="logo-mark">
                S
              </span>

              <span className="site-footer-brand-name">
                ShopSphere
              </span>
            </Link>

            <p className="site-footer-description">
              Discover thoughtfully selected products
              designed to bring quality, style and
              convenience to your everyday life.
            </p>

            <div className="site-footer-socials">

              <a href="#instagram">
                Instagram
              </a>

              <a href="#facebook">
                Facebook
              </a>

              <a href="#twitter">
                Twitter
              </a>

            </div>

          </div>


          {/* SHOP */}
          <div className="site-footer-column">

            <h3>Shop</h3>

            <div className="site-footer-links">

              <Link to="/products">
                All Products
              </Link>

              <Link to="/products?category=Men">
                Men
              </Link>

              <Link to="/products?category=Women">
                Women
              </Link>

              <Link to="/products?category=Accessories">
                Accessories
              </Link>

              <Link to="/products">
                New Arrivals
              </Link>

            </div>

          </div>


          {/* ACCOUNT */}
          <div className="site-footer-column">

            <h3>Account</h3>

            <div className="site-footer-links">

              <Link to="/profile">
                My Profile
              </Link>

              <Link to="/orders">
                My Orders
              </Link>

              <Link to="/wishlist">
                Wishlist
              </Link>

              <Link to="/cart">
                Shopping Cart
              </Link>

              <Link to="/login">
                Sign In
              </Link>

            </div>

          </div>


          {/* CONTACT */}
          <div className="site-footer-column">

            <h3>Contact</h3>

            <div className="site-footer-contact">

              <div className="footer-contact-item">
                <span className="footer-contact-label">
                  Location
                </span>

                <span>
                  India
                </span>
              </div>


              <div className="footer-contact-item">
                <span className="footer-contact-label">
                  Phone
                </span>

                <span>
                  +91 00000 00000
                </span>
              </div>


              <div className="footer-contact-item">
                <span className="footer-contact-label">
                  Email
                </span>

                <span>
                  support@shopsphere.com
                </span>
              </div>

            </div>


            <Link
              to="/products"
              className="footer-shop-btn"
            >
              <span>Start Shopping</span>
              <span className="footer-arrow">
                →
              </span>
            </Link>

          </div>

        </div>


        {/* =========================
            NEWSLETTER
        ========================= */}
        <div className="site-footer-newsletter">

          <div className="newsletter-content">

            <span className="site-footer-newsletter-label">
              STAY IN THE LOOP
            </span>

            <h3>
              Get updates from ShopSphere
            </h3>

            <p>
              New products, offers and updates
              delivered to your inbox.
            </p>

          </div>


          <form
            className="footer-newsletter-form"
            onSubmit={(event) =>
              event.preventDefault()
            }
          >

            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              required
            />

            <button type="submit">
              Subscribe
            </button>

          </form>

        </div>


        {/* =========================
            FOOTER BOTTOM
        ========================= */}
        <div className="site-footer-bottom">

          <p>
            © {new Date().getFullYear()} ShopSphere.
            All rights reserved.
          </p>

          <div className="site-footer-bottom-links">

            <a href="#privacy">
              Privacy Policy
            </a>

            <a href="#terms">
              Terms & Conditions
            </a>

            <a href="#shipping">
              Shipping & Returns
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
