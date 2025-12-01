import { useState, useEffect } from "react";
import { API } from "../service/api";
import "./Products.css";

const allowedSizes = ["S", "M", "L", "XL"];
const allCategories = ["clothing", "shoes", "accessories"]; // example categories

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      // Build query params based on selected filters
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (sizes.length) params.append("sizes", sizes.join(","));
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (search) params.append("search", search);

      const res = await API.get(`/api/products?${params.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Handlers for sizes checkbox toggling
  function toggleSize(size) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Products</h1>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="sizes-filter">
          {allowedSizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              {size}
            </label>
          ))}
        </div>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={fetchProducts}>Apply Filters</button>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.image} alt={p.name} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">
                  {p.name} <span className="price">₹{p.price}</span>
                </h3>
                <p className="description">{p.description}</p>
                <p>
                  <strong>Category:</strong> {p.category}
                </p>
                {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                  <p>
                    <strong>Sizes:</strong> {p.sizes.join(", ")}
                  </p>
                )}
                <p>
                  <strong>Stock:</strong> {p.stock}
                </p>
                <p className="date">
                  Added on: {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No products available</p>
      )}
    </div>
  );
}
