import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";

function App() {
  const [products, setProducts] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setProducts={setProducts} />} />
        <Route path="/products" element={<Products products={products} />} />
      </Routes>
    </Router>
  );
}

export default App;
