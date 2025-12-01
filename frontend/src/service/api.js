import axios from "axios";

export const API = axios.create({
  baseURL: "https://clothing-ecommerce-lmrs.onrender.com",
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
