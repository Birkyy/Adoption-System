import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

export const getPublicArticles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Articles`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Articles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- NEW: Create Article ---
export const createArticle = async (articleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Articles`, articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};