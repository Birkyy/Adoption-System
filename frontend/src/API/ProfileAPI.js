import axios from "axios";

const BASE_URL = "http://localhost:5118/api/Users";

/**
 * Fetch a user by their ID
 * @param {string} userId 
 * @returns {Promise<Object>} User data
 */

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile data
 * @param {string} userId 
 * @param {Object} userData - Object containing name, email, profession, bio, avatar, etc.
 * @returns {Promise<Object>} Response data
 */

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};