import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { handleProductImageError } from "../services/productService";

function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <section className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <Heart size={30} />
            </div>
            <h1>Your Wishlist Is Empty</h1>
            <p>Save products you love and come back to them whenever you like.</p>
            <Link to="/products" className="btn btn-primary">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="wishlist-header-content">
            <span className="small-heading">SAVED FOR LATER</span>
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">
              {wishlistItems.length} saved item{wishlistItems.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="clear-wishlist-btn"
            onClick={clearWishlist}
          >
            <Trash2 size={15} />
            Clear Wishlist
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((product) => {
            const productId = product.id || product._id;
            const price = Number(product.price) || 0;

            return (
              <article className="wishlist-card" key={productId}>
                <div className="wishlist-image-wrap">
                  <Link to={`/products/${productId}`} aria-label={`View ${product.name}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={handleProductImageError}
                    />
                  </Link>
                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() => removeFromWishlist(productId)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="wishlist-card-info">
                  <span className="product-category">{product.category}</span>
                  <Link to={`/products/${productId}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <div className="wishlist-card-price">
                    <strong>₹{price.toLocaleString("en-IN")}</strong>
                  </div>
                  <button
                    type="button"
                    className="wishlist-add-cart"
                    onClick={() => addToCart(product)}
                    disabled={Number(product.stock) === 0}
                  >
                    <ShoppingBag size={16} />
                    {Number(product.stock) === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Wishlist;