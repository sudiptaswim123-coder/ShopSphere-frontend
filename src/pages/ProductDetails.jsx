import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  fetchProductById,
  handleProductImageError,
} from "../services/productService";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [addedMessage, setAddedMessage] =
    React.useState("");

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState("");

  /* ==============================
     FETCH PRODUCT
  ============================== */

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProductById(id);

        setProduct(data);
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        setError(
          error.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /* ==============================
     LOADING
  ============================== */

  if (loading) {
    return (
      <section className="product-details-page">
        <div className="container">
          <div className="products-loading">
            <div className="loading-spinner" />

            <p>
              Loading product...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ==============================
     ERROR
  ============================== */

  if (error || !product) {
    return (
      <section className="product-details-page">
        <div className="container">
          <div className="empty-products">
            <h2>
              Product not found
            </h2>

            <p>
              {error ||
                "The product you are looking for does not exist."}
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
              to="/products"
              className="btn btn-primary"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ==============================
     DISCOUNT
  ============================== */

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || price;
  const discount = oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  /* ==============================
     ADD TO CART
  ============================== */

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setAddedMessage(
      `${quantity} ${
        quantity === 1 ? "item" : "items"
      } added to your cart.`
    );

    setTimeout(() => {
      setAddedMessage("");
    }, 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const productId = product.id || product._id;

  return (
    <section className="product-details-page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="details-breadcrumb">
          <Link to="/products">
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>

        <div className="product-details">

          {/* ==============================
              IMAGE
          ============================== */}

          <div className="details-image-wrap">

            <span className="details-badge">
              {product.badge}
            </span>

            <button
              type="button"
              className={`details-wishlist ${isInWishlist(productId) ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isInWishlist(productId) ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isInWishlist(productId)}
            >
              <Heart size={20} />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="details-image"
              onError={handleProductImageError}
            />

          </div>

          {/* ==============================
              INFORMATION
          ============================== */}

          <div className="details-info">

            <span className="details-category">
              {product.category}
            </span>

            <h1>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="details-rating">

              <span className="stars">
                <Star
                  size={16}
                  fill="currentColor"
                />
                <Star
                  size={16}
                  fill="currentColor"
                />
                <Star
                  size={16}
                  fill="currentColor"
                />
                <Star
                  size={16}
                  fill="currentColor"
                />
                <Star
                  size={16}
                  fill="currentColor"
                />
              </span>

              <strong>
                {Number(product.rating || 0).toFixed(1)}
              </strong>

              <span>
                {Number(product.reviews || 0)} verified reviews
              </span>

            </div>

            {/* Price */}
            <div className="details-price">

              <span className="details-current-price">
                ₹
                {price.toLocaleString("en-IN")}
              </span>

              {oldPrice > price && (
                <>
                  <span className="details-old-price">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>

                  <span className="details-discount">
                    {discount}% OFF
                  </span>
                </>
              )}

            </div>

            {/* Description */}
            <p className="details-description">
              {product.description ||
                "Premium quality product designed for everyday comfort, style and reliable performance."}
            </p>

            {/* Stock */}
            {product.stock > 0 && (
              <p className="product-stock">
                {product.stock} items available
              </p>
            )}

            {/* Quantity */}
            <div className="quantity-section">

              <span>
                Quantity
              </span>

              <div className="quantity-control">

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        product.stock || 99,
                        q + 1
                      )
                    )
                  }
                  aria-label="Increase quantity"
                  disabled={
                    product.stock > 0 &&
                    quantity >= product.stock
                  }
                >
                  <Plus size={16} />
                </button>

              </div>
            </div>

            {/* Actions */}
            <div className="details-actions">

              <button
                className="btn btn-primary add-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={18} />

                {product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              <button
                className="details-buy-btn"
                onClick={handleBuyNow}
                disabled={Number(product.stock || 0) === 0}
              >
                Buy Now
              </button>

            </div>

            {/* Added Message */}
            {addedMessage && (
              <div className="cart-added-message">
                {addedMessage}
              </div>
            )}

            {/* Benefits */}
            <div className="product-benefits">

              <div>
                <strong>
                  Free Shipping
                </strong>

                <span>
                  On orders over ₹999
                </span>
              </div>

              <div>
                <strong>
                  Easy Returns
                </strong>

                <span>
                  7-day return policy
                </span>
              </div>

              <div>
                <strong>
                  Secure Payment
                </strong>

                <span>
                  100% secure checkout
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;