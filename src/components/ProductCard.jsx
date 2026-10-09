import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import {
  handleProductImageError,
  PRODUCT_IMAGE_FALLBACK,
} from "../services/productService";

function ProductCard({ product }) {
  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  if (!product) {
    return null;
  }

  const productId =
    product.id || product._id;

  const name =
    product.name || "Unnamed Product";

  const category =
    product.category || "General";

  const price =
    Number(product.price) || 0;

  const oldPrice =
    Number(product.oldPrice) || price;

  const rating =
    Number(product.rating) || 0;

  const reviews =
    Number(product.reviews) || 0;

  const image =
    product.image ||
    PRODUCT_IMAGE_FALLBACK;

  const badge =
    product.badge || "NEW";

  const discount =
    oldPrice > price
      ? Math.round(
          ((oldPrice - price) / oldPrice) * 100
        )
      : 0;

  return (
    <article className="product-card">

      {/* Product Image */}

      <div className="product-image-wrap">

        <Link
          to={`/products/${productId}`}
          aria-label={`View ${name}`}
        >
          <img
            src={image}
            alt={name}
            className="product-image"
            loading="lazy"
            onError={handleProductImageError}
          />
        </Link>


        {/* Badge */}

        <span className="product-badge">
          {badge}
        </span>


        {/* Wishlist */}
        <button
          className={`details-wishlist ${
            isInWishlist(productId)
              ? "active"
              : ""
          }`}
          onClick={() =>
            toggleWishlist(product)
          }
          aria-label={
            isInWishlist(productId)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isInWishlist(product.id)}
        >
          <Heart
            size={20}
            fill={
              isInWishlist(productId)
                ? "currentColor"
                : "none"
            }
          />
        </button>


        {/* View Product */}

        <Link
          to={`/products/${productId}`}
          className="quick-add"
        >
          <ShoppingBag size={17} />
          View Product
        </Link>

      </div>


      {/* Product Information */}

      <div className="product-info">

        <span className="product-category">
          {category}
        </span>


        <Link
          to={`/products/${productId}`}
        >
          <h3 className="product-name">
            {name}
          </h3>
        </Link>


        {/* Rating */}

        <div className="product-rating">

          <Star
            size={14}
            fill="currentColor"
          />

          <span>
            {rating.toFixed(1)}
          </span>

          <span className="review-count">
            ({reviews})
          </span>

        </div>


        {/* Price */}

        <div className="product-price">

          <span className="current-price">
            ₹
            {price.toLocaleString("en-IN")}
          </span>

          {oldPrice > price && (
            <span className="old-price">
              ₹
              {oldPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}

          {discount > 0 && (
            <span className="discount">
              {discount}% OFF
            </span>
          )}

        </div>

      </div>

    </article>
  );
}

export default ProductCard;