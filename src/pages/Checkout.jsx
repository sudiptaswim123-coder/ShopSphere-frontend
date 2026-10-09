
import React, { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MapPin,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { handleProductImageError } from "../services/productService";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, token, user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const shippingFee = useMemo(() => {
    if (cartTotal === 0) return 0;
    return cartTotal >= 1999 ? 0 : 99;
  }, [cartTotal]);

  const taxAmount = useMemo(() => {
    return Math.round(cartTotal * 0.05);
  }, [cartTotal]);

  const finalTotal = cartTotal + shippingFee + taxAmount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      return "Please sign in before placing your order.";
    }

    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    if (cartItems.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setFormError("");
    try {
      const data = await apiRequest("/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          },
          items: cartItems.map((item) => ({
            product: item.id || item._id,
            quantity: Number(item.quantity),
          })),
          deliveryAddress: {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            landmark: formData.landmark.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
          },
          paymentMethod,
          totals: {
            subtotal: cartTotal,
            shipping: shippingFee,
            tax: taxAmount,
            total: finalTotal,
          },
        }),
      });

      localStorage.setItem(
        "shopsphere-last-order",
        JSON.stringify(data.order)
      );

      clearCart();

      navigate("/order-success");
    } catch (error) {
      console.error("Order creation error:", error);
      setFormError(
        error.message || "Something went wrong while placing your order. Please try again."
      );
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              <ShoppingBag size={30} />
            </div>

            <h1>Your cart is empty</h1>

            <p>
              Add some products to your cart before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="container">

        {/* HEADER */}
        <div className="checkout-header">

          <div>
            <Link
              to="/cart"
              className="checkout-back-link"
            >
              <ArrowLeft size={15} />
              Back to Cart
            </Link>

            <span className="small-heading">
              Secure Checkout
            </span>

            <h1 className="checkout-title">
              Complete Your Order
            </h1>

            <p className="checkout-subtitle">
              Enter your delivery details and review your order before placing it.
            </p>
          </div>

        </div>


        {/* LOGIN NOTICE */}
        {!isAuthenticated && (
          <div className="checkout-login-notice">
            <ShieldCheck size={18} />

            <div>
              <strong>Please sign in to continue</strong>

              <span>
                You need an account before placing an order.
              </span>
            </div>

            <Link to="/login">
              Sign In
            </Link>
          </div>
        )}


        {/* ERROR */}
        {formError && (
          <div className="checkout-form-error">
            {formError}
          </div>
        )}


        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* LEFT */}
          <div className="checkout-main">

            {/* DELIVERY */}
            <div className="checkout-card">

              <div className="checkout-card-header">
                <div className="checkout-card-icon">
                  <MapPin size={17} />
                </div>

                <div>
                  <h2>Delivery Address</h2>
                  <p>
                    Where should we deliver your order?
                  </p>
                </div>
              </div>


              <div className="checkout-form-grid">

                <div className="checkout-field">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>


                <div className="checkout-field">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>


                <div className="checkout-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                </div>


                <div className="checkout-field">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                  />
                </div>


                <div className="checkout-field checkout-field-full">
                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no., street, area"
                    rows="4"
                  />
                </div>


                <div className="checkout-field checkout-field-full">
                  <label htmlFor="landmark">
                    Landmark
                    <span>Optional</span>
                  </label>

                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark"
                  />
                </div>


                <div className="checkout-field">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                  />
                </div>


                <div className="checkout-field">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Your state"
                  />
                </div>

              </div>
            </div>


            {/* PAYMENT */}
            <div className="checkout-card">

              <div className="checkout-card-header">
                <div className="checkout-card-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h2>Payment Method</h2>
                  <p>
                    Choose how you want to pay.
                  </p>
                </div>
              </div>


              <div className="payment-options">

                <label
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "active"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <span className="payment-radio">
                    <Check size={13} />
                  </span>

                  <span className="payment-info">
                    <strong>Cash on Delivery</strong>
                    <small>
                      Pay when your order arrives.
                    </small>
                  </span>
                </label>


                <label
                  className={`payment-option ${
                    paymentMethod === "online"
                      ? "active"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <span className="payment-radio">
                    <Check size={13} />
                  </span>

                  <span className="payment-info">
                    <strong>Online Payment</strong>
                    <small>
                      Payment gateway can be connected later.
                    </small>
                  </span>
                </label>

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <aside className="checkout-summary">

            <div className="checkout-summary-card">

              <div className="checkout-summary-header">
                <h2>Order Summary</h2>

                <span>
                  {cartItems.length}{" "}
                  {cartItems.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>


              {/* ITEMS */}
              <div className="checkout-items">

                {cartItems.map((item) => {

                  const productId =
                    item.id || item._id;

                  return (
                    <div
                      className="checkout-item"
                      key={productId}
                    >

                      <div className="checkout-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={handleProductImageError}
                        />

                        <span>
                          {item.quantity}
                        </span>
                      </div>

                      <div className="checkout-item-info">
                        <h3>{item.name}</h3>

                        <p>
                          ₹
                          {Number(item.price).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <strong>
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>
                  );
                })}

              </div>


              <div className="checkout-divider" />


              {/* PRICING */}
              <div className="checkout-price-row">
                <span>Subtotal</span>
                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>


              <div className="checkout-price-row">
                <span>Delivery</span>

                <strong className={
                  shippingFee === 0
                    ? "free-delivery"
                    : ""
                }>
                  {shippingFee === 0
                    ? "FREE"
                    : `₹${shippingFee}`}
                </strong>
              </div>


              <div className="checkout-price-row">
                <span>Tax</span>

                <strong>
                  ₹{taxAmount.toLocaleString("en-IN")}
                </strong>
              </div>


              <div className="checkout-divider" />


              <div className="checkout-total-row">
                <span>Total</span>

                <strong>
                  ₹{finalTotal.toLocaleString("en-IN")}
                </strong>
              </div>


              <button
                type="submit"
                className="checkout-place-order"
                disabled={submitting}
              >
                <ShieldCheck size={17} />
                {submitting ? "Placing Order..." : "Place Order"}
              </button>


              <p className="checkout-secure-note">
                Your order information is securely stored.
              </p>

            </div>

          </aside>

        </form>

      </div>
    </section>
  );
}

export default Checkout;
