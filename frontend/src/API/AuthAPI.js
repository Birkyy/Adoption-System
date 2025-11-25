import axios from "axios";

const API_BASE_URL = "http://localhost:5118/api/users"; 

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
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
    const response = await axios.post(`${API_BASE_URL}/register/public`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const requestNgoAccount = async (ngoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request/ngo`, ngoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};