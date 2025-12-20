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

export const getMyArticles = async (authorId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Articles/my-articles`, {
      params: { authorId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArticle = async (id, currentUserId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Articles/${id}`, {
      params: { currentUserId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};