import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "shopsphere-wishlist";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist =
        localStorage.getItem(STORAGE_KEY);

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      return [];
    }
  });

  /* ==============================
     SAVE TO LOCAL STORAGE
  ============================== */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);


  /* ==============================
     PRODUCT ID HELPER
  ============================== */

  const getProductId = (product) => {
    return String(product.id || product._id);
  };


  /* ==============================
     CHECK WISHLIST
  ============================== */

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) =>
        getProductId(item) === String(productId)
    );
  };


  /* ==============================
     TOGGLE WISHLIST
  ============================== */

  const toggleWishlist = (product) => {
    if (!product) return;

    const productId = getProductId(product);

    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) =>
          getProductId(item) === productId
      );

      if (exists) {
        return currentItems.filter(
          (item) =>
            getProductId(item) !== productId
        );
      }

      return [...currentItems, product];
    });
  };


  /* ==============================
     REMOVE ITEM
  ============================== */

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) =>
          getProductId(item) !== String(productId)
      )
    );
  };


  /* ==============================
     CLEAR WISHLIST
  ============================== */

  const clearWishlist = () => {
    setWishlistItems([]);
  };


  /* ==============================
     COUNT
  ============================== */

  const wishlistCount = wishlistItems.length;


  const value = {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };


  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}


export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}