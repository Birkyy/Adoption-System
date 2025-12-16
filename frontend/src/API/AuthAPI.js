import api from "./axiosInstance";

// Note: axiosInstance base URL is likely "http://localhost:5118/api"
// So we just append "/users/..."

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const registerPublicUser = async (userData) => {
  try {
    const response = await api.post("/users/register/public", userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const requestNgoAccount = async (ngoData) => {
  try {
    const response = await api.post("/users/request/ngo", ngoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};