import { useState } from "react";
import { API } from "../service/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setProducts }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await API.post("/login/", { email, password });
      alert("Login successful!");
      // Fetch products after login
      const res = await API.get("/api/products");
      console.log(res.data);
      setProducts(res.data);
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
