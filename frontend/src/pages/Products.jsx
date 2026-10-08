import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (category !== "All") {
          params.category = category;
        }

        if (sort) {
          params.sort = sort;
        }

        const response = await api.get(
          "/products",
          {
            params,
          }
        );

        setProducts(
          response.data.products
        );

      } catch (err) {
        console.error(
          "Products fetch error:",
          err
        );

        setError(
          "Something went wrong while loading products."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [search, category, sort]);

  return (
    <>
      <Navbar />

      <main className="catalog-page">
        <section className="catalog-header">
          <div>
            <p className="section-eyebrow">
              ShopKart Catalogue
            </p>

            <h1>
              Discover Products
            </h1>

            <p>
              Search and explore products
              available on ShopKart.
            </p>
          </div>
        </section>

        <section className="catalog-controls">
          <div className="catalog-search">
            <label htmlFor="product-search">
              Search
            </label>

            <input
              id="product-search"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="catalog-filter">
            <label htmlFor="category-filter">
              Category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Books">
                Books
              </option>

              <option value="Home">
                Home
              </option>

              <option value="Beauty">
                Beauty
              </option>

              <option value="Footwear">
                Footwear
              </option>

              <option value="Photography">
                Photography
              </option>

              <option value="Laptops">
                Laptops
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Wearables">
                Wearables
              </option>
            </select>
          </div>

          <div className="catalog-filter">
            <label htmlFor="sort-filter">
              Sort
            </label>

            <select
              id="sort-filter"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >
              <option value="">
                Default
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </section>

        {loading && (
          <div className="catalog-state">
            <div
              className="loading-spinner"
              aria-label="Loading"
            />

            <p>Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="catalog-state">
            <p className="catalog-error">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="catalog-state">
              <p className="catalog-empty-icon">
                🔎
              </p>

              <h2>
                No products found.
              </h2>

              <p>
                Try changing your search
                or category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <div className="catalog-result-count">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}{" "}
                found
              </div>

              <div className="catalog-products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
      </main>
    </>
  );
}

export default Products;