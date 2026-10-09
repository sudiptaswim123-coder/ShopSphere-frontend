
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const [selectedCategory, setSelectedCategory] =
    useState(searchParams.get("category") || "All");

  const [selectedGender, setSelectedGender] =
    useState(searchParams.get("gender") || "All");

  const [stockOnly, setStockOnly] = useState(
    searchParams.get("stock") === "true"
  );

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "featured"
  );

  const [showMobileFilter, setShowMobileFilter] =
    useState(false);


  /* =========================================
     LOAD PRODUCTS
  ========================================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProducts();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error("Products error:", err);

        setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  /* =========================================
     SYNC URL SEARCH
  ========================================= */

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") || "";
    const urlCategory =
      searchParams.get("category") || "All";
    const urlGender =
      searchParams.get("gender") || "All";
    const urlStockOnly = searchParams.get("stock") === "true";
    const requestedSort = searchParams.get("sort") || "featured";
    const validSorts = ["featured", "price-low", "price-high", "rating", "name"];

    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedGender(["All", "Male", "Female", "Kids", "Unisex"].includes(urlGender) ? urlGender : "All");
    setStockOnly(urlStockOnly);
    setSortBy(validSorts.includes(requestedSort) ? requestedSort : "featured");
  }, [searchParams]);


  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    if (selectedCategory !== "All" && !uniqueCategories.includes(selectedCategory)) {
      uniqueCategories.push(selectedCategory);
    }

    return ["All", ...uniqueCategories];
  }, [products, selectedCategory]);


  /* =========================================
     FILTER + SEARCH + SORT
  ========================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const query =
      searchQuery.trim().toLowerCase();


    /* SEARCH */
    if (query) {
      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const category =
          product.category?.toLowerCase() || "";

        const gender =
          product.gender?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        return (
          name.includes(query) ||
          category.includes(query) ||
          gender.includes(query) ||
          description.includes(query)
        );
      });
    }


    /* CATEGORY */
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category ===
          selectedCategory
      );
    }


    /* GENDER */
    if (selectedGender !== "All") {
      result = result.filter(
        (product) => (product.gender || "Unisex") === selectedGender
      );
    }


    /* STOCK */
    if (stockOnly) {
      result = result.filter(
        (product) =>
          Number(product.stock || 0) > 0
      );
    }


    /* SORT */
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          (a.name || "").localeCompare(
            b.name || ""
          )
        );
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(Boolean(b.featured)) -
            Number(Boolean(a.featured))
        );
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedGender,
    stockOnly,
    sortBy,
  ]);


  /* =========================================
     SEARCH SUBMIT
  ========================================= */

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    const nextSearchParams = new URLSearchParams(searchParams);

    if (query) {
      nextSearchParams.set("search", query);
    } else {
      nextSearchParams.delete("search");
    }

    setSearchParams(nextSearchParams);
  };


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  const clearSearch = () => {
    setSearchQuery("");
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("search");
    setSearchParams(nextSearchParams);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const nextSearchParams = new URLSearchParams(searchParams);
    if (category === "All") {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", category);
    }

    setSearchParams(nextSearchParams);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);

    const nextSearchParams = new URLSearchParams(searchParams);
    if (gender === "All") {
      nextSearchParams.delete("gender");
    } else {
      nextSearchParams.set("gender", gender);
    }

    setSearchParams(nextSearchParams);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    const nextSearchParams = new URLSearchParams(searchParams);
    if (sort === "featured") nextSearchParams.delete("sort");
    else nextSearchParams.set("sort", sort);
    setSearchParams(nextSearchParams);
  };

  const handleStockChange = (checked) => {
    setStockOnly(checked);
    const nextSearchParams = new URLSearchParams(searchParams);
    if (checked) nextSearchParams.set("stock", "true");
    else nextSearchParams.delete("stock");
    setSearchParams(nextSearchParams);
  };


  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setStockOnly(false);
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };


  return (
    <section className="products-page">

      <div className="container">

        {/* HEADER */}
        <div className="products-header">

          <div>
            <span className="small-heading">
              Shop Collection
            </span>

            <h1 className="products-title">
              All Products
            </h1>

            <p className="products-description">
              Explore our curated collection of
              products designed for modern everyday
              living.
            </p>
          </div>

          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() =>
              setShowMobileFilter(
                (previous) => !previous
              )
            }
          >
            <SlidersHorizontal size={15} />
            {showMobileFilter
              ? "Hide Filters"
              : "Show Filters"}
          </button>

        </div>


        {/* TOOLBAR */}
        <div className="products-toolbar">

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <Search size={17} />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search products..."
              aria-label="Search products"
            />

            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>


          <div className="sort-box">

            <label htmlFor="sort">
              Sort by
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) =>
                handleSortChange(event.target.value)
              }
            >
              <option value="featured">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="name">
                Name A-Z
              </option>
            </select>

          </div>

        </div>


        {/* MAIN CONTENT */}
        <div className="products-layout">


          {/* SIDEBAR */}
          <aside
            className={`filter-sidebar ${
              showMobileFilter
                ? "show-mobile"
                : ""
            }`}
          >

            <div className="filter-heading">

              <div>
                <Filter size={15} />
                <h3>Filters</h3>
              </div>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear All
              </button>

            </div>


            {/* GENDER */}
            <div className="filter-section">

              <h4>
                Gender
              </h4>

              <div className="category-filter">
                {["All", "Male", "Female", "Kids"].map((gender) => (
                  <button
                    type="button"
                    key={gender}
                    className={selectedGender === gender ? "active" : ""}
                    onClick={() => handleGenderChange(gender)}
                  >
                    <span>{gender === "All" ? "All" : gender}</span>
                    <span>
                      {gender === "All"
                        ? products.length
                        : products.filter((product) => (product.gender || "Unisex") === gender).length}
                    </span>
                  </button>
                ))}
              </div>

            </div>


            {/* CATEGORY */}
            <div className="filter-section">

              <h4>
                Category
              </h4>

              <div className="category-filter">

                {categories.map(
                  (category) => (
                    <button
                      type="button"
                      key={category}
                      className={
                        selectedCategory ===
                        category
                          ? "active"
                          : ""
                      }
                      onClick={() => handleCategoryChange(category)}
                    >
                      <span>
                        {category}
                      </span>

                      <span>
                        {category === "All"
                          ? products.length
                          : products.filter(
                              (product) =>
                                product.category ===
                                category
                            ).length}
                      </span>
                    </button>
                  )
                )}

              </div>

            </div>


            {/* STOCK */}
            <div className="filter-section">

              <h4>
                Availability
              </h4>

              <label className="checkbox-row">

                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(event) => handleStockChange(event.target.checked)}
                />

                <span>
                  In Stock Only
                </span>

              </label>

            </div>

          </aside>


          {/* PRODUCTS */}
          <div className="products-content">

            <div className="results-top">

              <p>
                Showing{" "}
                <strong>
                  {filteredProducts.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {products.length}
                </strong>{" "}
                products
              </p>

              {searchQuery && (
                <span className="active-filter">
                  Search: "{searchQuery}"
                </span>
              )}

              {selectedCategory !== "All" && (
                <span className="active-filter">
                  {selectedCategory}
                </span>
              )}

              {selectedGender !== "All" && (
                <span className="active-filter">
                  {selectedGender}
                </span>
              )}

            </div>


            {/* LOADING */}
            {loading && (
              <div className="products-loading">

                <div className="loading-spinner" />

                <p>
                  Loading products...
                </p>

              </div>
            )}


            {/* ERROR */}
            {!loading && error && (
              <div className="products-error">

                <h2>
                  Unable to Load Products
                </h2>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>

              </div>
            )}


            {/* EMPTY */}
            {!loading &&
              !error &&
              filteredProducts.length === 0 && (
                <div className="empty-products">

                  <div className="empty-icon">
                    <Search size={27} />
                  </div>

                  <h2>
                    No Products Found
                  </h2>

                  <p>
                    Try changing your search or
                    filters to find what you are
                    looking for.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                </div>
              )}


            {/* PRODUCT GRID */}
            {!loading &&
              !error &&
              filteredProducts.length > 0 && (
                <div className="product-grid products-grid-page">

                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={
                          product.id ||
                          product._id
                        }
                        product={product}
                      />
                    )
                  )}

                </div>
              )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default Products;
