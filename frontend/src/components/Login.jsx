import { useState } from "react";
import { API } from "../service/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setProducts }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await API.post("/login/", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login Successful!");
    navigate("/products");
  } catch (err) {
    navigate('/products')
    console.log(err);
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
