import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "http://localhost:3001",  // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set/remove JWT token in headers
export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

// Auth endpoints
export const signup = (username, password) =>
  instance.post("/api/auth/signup", { username, password });

export const login = (username, password) =>
  instance.post("/api/auth/login", { username, password });

// Verify token endpoint (optional)
export const verifyToken = () =>
  instance.get("/api/auth/verify");

export default instance;
