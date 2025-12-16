import api from "./axiosInstance";

// Note: The axiosInstance base URL is ".../api", 
// so we append "/Users" here.

/**
 * Fetch a user by their ID
 * @param {string} userId 
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/Users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile data
 * @param {string} userId 
 * @param {Object} userData 
 * @returns {Promise<Object>} Response data
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/Users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicProfile = async (id) => {
  try {
    const response = await api.get(`/Users/public-profile/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};