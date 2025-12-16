import api from "./axiosInstance";

// UPDATED: Now accepts 'params' for server-side filtering & pagination
export const getPublicArticles = async (params = {}) => {
  try {
    // Axios sends these as ?page=1&search=...&category=...
    const response = await api.get("/Articles", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await api.get(`/Articles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    // The JWT token is automatically attached by the interceptor
    const response = await api.post("/Articles", articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};