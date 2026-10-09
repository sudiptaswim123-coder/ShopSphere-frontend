import { apiRequest } from "./api";

export const PRODUCT_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80";

export const handleProductImageError = (event) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;

  image.dataset.fallbackApplied = "true";
  image.src = PRODUCT_IMAGE_FALLBACK;
};

/* ==============================
   NORMALIZE PRODUCT
================================ */

const normalizeProduct = (product) => {
  return {
    ...product,
    id: product._id,
    image: product.image || PRODUCT_IMAGE_FALLBACK,
  };
};


/* ==============================
   GET ALL PRODUCTS
================================ */

export const fetchProducts = async () => {
  const data = await apiRequest("/products");
  return (Array.isArray(data.products) ? data.products : []).map(normalizeProduct);
};


/* ==============================
   GET SINGLE PRODUCT
================================ */

export const fetchProductById = async (id) => {
  const data = await apiRequest(`/products/${id}`);
  return normalizeProduct(data.product);
};

const authenticatedOptions = (token, method, body) => ({
  method,
  headers: { Authorization: `Bearer ${token}` },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export const createProduct = async (product, token) => {
  const data = await apiRequest(
    "/products",
    authenticatedOptions(token, "POST", product)
  );
  return normalizeProduct(data.product);
};

export const updateProduct = async (id, product, token) => {
  const data = await apiRequest(
    `/products/${id}`,
    authenticatedOptions(token, "PUT", product)
  );
  return normalizeProduct(data.product);
};

export const deleteProduct = async (id, token) => {
  return apiRequest(
    `/products/${id}`,
    authenticatedOptions(token, "DELETE")
  );
};