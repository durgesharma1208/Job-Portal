import axios from "axios";

/**
 * Centralized axios client.
 * Replaces the ~10 hardcoded `http://localhost:5000` URLs across the app.
 *
 * Uses Vite env `VITE_API_URL` if provided, otherwise falls back to localhost.
 * `withCredentials` is on globally so cookie sessions work everywhere.
 */
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
