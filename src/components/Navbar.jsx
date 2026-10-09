
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  LogOut,
  Heart,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartCount } = useCart();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(location.pathname === "/products" ? query : "");
  }, [location.pathname, location.search]);

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenu(false);
    navigate("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    const params = new URLSearchParams(
      location.pathname === "/products" ? location.search : ""
    );
    if (query) params.set("search", query);
    else params.delete("search");

    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ""}`);

    setShowSearch(false);
    setMobileMenu(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (location.pathname !== "/products") return;

    const params = new URLSearchParams(location.search);
    params.delete("search");
    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const currentGender = new URLSearchParams(location.search).get("gender") || "";

  return (
    <header className="navbar">
      <div className="navbar-main-row">
        <div className="container navbar-main-inner">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-mark"><ShoppingBag size={21} /></span>
            <span>
              <span className="logo-text">Shop<span>Sphere</span></span>
              <small className="logo-tagline">Better Choices. Brighter You.</small>
            </span>
          </Link>

          <form className="desktop-navbar-search" onSubmit={handleSearchSubmit}>
            <Search size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for products, brands and more..."
              aria-label="Search products"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
            <button type="submit" className="desktop-search-submit" aria-label="Submit search">
              <Search size={17} />
            </button>
          </form>

          <div className="navbar-actions">
            <div className="user-menu-wrapper">
              <button
                type="button"
                className="account-action"
                onClick={() => {
                  setShowUserMenu((previous) => !previous);
                  setShowSearch(false);
                }}
                aria-label="Account"
              >
                <UserRound size={19} />
                <span><small>Account</small><strong>{isAuthenticated ? (user?.name || "Account") : "Sign In"}</strong></span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="user-dropdown-header">
                        <span className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</span>
                        <div><strong>{user?.name}</strong><span>{user?.email}</span></div>
                      </div>
                      <Link to="/profile" className="dropdown-profile-btn" onClick={() => setShowUserMenu(false)}>View Profile</Link>
                      {String(user?.role || "").toLowerCase() === "admin" && (
                        <Link to="/admin" className="dropdown-profile-btn admin-dropdown-btn" onClick={() => setShowUserMenu(false)}>Admin Panel</Link>
                      )}
                      <div className="dropdown-divider" />
                      <button type="button" className="logout-btn" onClick={handleLogout}><LogOut size={16} /> Logout</button>
                    </>
                  ) : (
                    <>
                      <div className="guest-message"><strong>Welcome to ShopSphere</strong><span>Sign in to manage your account.</span></div>
                      <div className="dropdown-divider" />
                      <Link to="/login" className="dropdown-login-btn" onClick={() => setShowUserMenu(false)}>Sign In</Link>
                      <Link to="/register" className="dropdown-register-btn" onClick={() => setShowUserMenu(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/wishlist" className="icon-btn wishlist-nav-btn" aria-label="Wishlist" onClick={closeMobileMenu}>
              <Heart size={19} fill={wishlistCount > 0 ? "currentColor" : "none"} />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </Link>

            <Link to="/cart" className="cart-action" aria-label="Cart" onClick={closeMobileMenu}>
              <ShoppingBag size={20} />
              <span><small>Cart</small><strong>My Bag</strong></span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenu((previous) => !previous)} aria-label="Toggle menu">
              {mobileMenu ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      <div className="navbar-nav-row">
        <div className="container navbar-nav-inner">
          <button type="button" className="category-menu-button" onClick={() => setMobileMenu((previous) => !previous)}>
            <Menu size={18} /> <span>All Categories</span>
          </button>
          <nav className={`nav-links ${mobileMenu ? "active" : ""}`}>
            <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMobileMenu}>Home</Link>
            <Link to="/products" className={location.pathname === "/products" && !currentGender ? "active" : ""} onClick={closeMobileMenu}>Shop</Link>
            <Link to="/products?gender=Male" className={currentGender === "Male" ? "gender-men active" : "gender-men"} onClick={closeMobileMenu}>♂ Men</Link>
            <Link to="/products?gender=Female" className={currentGender === "Female" ? "gender-women active" : "gender-women"} onClick={closeMobileMenu}>♀ Women</Link>
            <Link to="/products?gender=Kids" className={currentGender === "Kids" ? "gender-kids active" : "gender-kids"} onClick={closeMobileMenu}>♧ Kids</Link>
            <Link to="/products?sort=featured" onClick={closeMobileMenu}>Best Sellers</Link>
            <Link to="/products?sort=featured" onClick={closeMobileMenu}>New Arrivals</Link>
            <Link to="/products" onClick={closeMobileMenu}>Deals</Link>
          </nav>
        </div>
      </div>
    </header>
  );}

export default Navbar;
