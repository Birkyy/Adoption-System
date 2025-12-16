import api from "./axiosInstance";

export const getPets = async (filters = {}) => {
  try {
    const params = {
      status: "Available",
      ...filters
    };
    // api.get("/Pets", { params }) is cleaner
    const response = await api.get("/Pets", { params });
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
    const response = await api.get(`/Pets/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePet = async (id, petData, userId) => {
  try {
    const response = await api.put(`/Pets/${id}?currentUserId=${userId}`, petData);
    return response.data;
  } catch (error) {
    throw error;
  }
};