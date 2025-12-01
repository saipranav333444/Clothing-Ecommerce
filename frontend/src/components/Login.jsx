import { useState } from "react";
import { API } from "../service/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setProducts }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/login/", { email, password });
      const token = response.data.token; // adjust based on your API response
      console.log(token);
      if (token) {
        localStorage.setItem("authToken", token); // or use context/provider
        alert("Login successful!");
        navigate("/products");
      } else {
        alert("Login failed: no token received");
      }
    } catch (err) {
      console.error(err);
      navigate("/products");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
