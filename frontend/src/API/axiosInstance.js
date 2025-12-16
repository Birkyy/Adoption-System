import axios from "axios";

// Create a base instance
const api = axios.create({
  baseURL: "http://localhost:5118/api", // Change this to your actual Backend URL
});

// Add a Request Interceptor
// This runs BEFORE every request is sent
api.interceptors.request.use(
  (config) => {
    // Try to get the token from localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    // If token exists, attach it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a Response Interceptor to handle 401 (Unauthorized) automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // You could trigger a logout here or redirect to login
      // window.location.href = '/signin'; 
    }
    return Promise.reject(error);
  }
);

export default api;