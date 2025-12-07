import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

export const getPets = async (filters = {}) => {
  try {

    const params = {
      status: "Available",
      ...filters
    };

    const response = await axios.get(`${BASE_URL}/Pets`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPetsBySpecies = async (species, status = "Available") => {
  return getPets({ species, status });
};

export const getPetById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Pets/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePet = async (id, petData, userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/Pets/${id}?currentUserId=${userId}`, petData);
    return response.data;
  } catch (error) {
    throw error;
  }
};