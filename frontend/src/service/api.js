import axios from "axios";

export const API = axios.create({
  baseURL: "https://clothing-ecommerce-flax.vercel.app/",
  withCredentials: true,
});
