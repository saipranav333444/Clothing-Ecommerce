import axios from "axios";

export const API = axios.create({
  baseURL: "https://clothing-ecommerce-lmrs.onrender.com",
  withCredentials: true,
});
