import api from "./axiosInstance";

export const getPublicArticles = async () => {
  try {
    const response = await api.get("/Articles");
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
    // The JWT token is now automatically attached by the interceptor
    const response = await api.post("/Articles", articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};