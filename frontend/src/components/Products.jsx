import { useState, useEffect } from "react";
import { API } from "../service/api";
import "./Products.css";

// Make sure to import your API helper/instance

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  API.get("/api/products")
    .then((res) => setProducts(res.data))
    .catch((err) => console.log("Error fetching products:", err));
}, []);


  return (
    <div className="products-container">
      <h1 className="products-title">Products</h1>

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
