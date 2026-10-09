import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";
import { handleProductImageError } from "../services/productService";

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={32} />
            </div>

            <h1>Your Cart Is Empty</h1>

            <p>
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">

        <div className="cart-header">
          <div>
            <span className="small-heading">SHOPPING BAG</span>

            <h1 className="cart-title">
              Your Cart
            </h1>

            <p className="cart-subtitle">
              {cartItems.length} unique item
              {cartItems.length !== 1 ? "s" : ""} in your bag.
            </p>
          </div>

          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items">

            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>

                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={handleProductImageError}
                  />
                </Link>

                <div className="cart-item-details">

                  <span className="cart-item-category">
                    {item.category}
                  </span>

                  <Link to={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>

                  <p className="cart-item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="cart-item-bottom">

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <strong>
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                </button>

              </article>
            ))}
          </div>

          {/* Summary */}
          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-text">FREE</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
            </Link>
            
            

            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </aside>

        </div>
      </div>
    </section>
  );
}

export default Cart;