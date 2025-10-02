import axios from "axios";

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export the base URL for direct usage if needed
export const API_URL = API_BASE_URL;
