import api from "./axiosInstance";

// UPDATED: Now accepts 'params' for Pagination & Search
export const getVolunteerListings = async (params = {}) => {
  const response = await api.get("/Volunteer", { params });
  return response.data;
};

// SECURITY UPDATE: No arguments needed (ID comes from Token)
export const getMyVolunteerListings = async () => {
  const response = await api.get("/Volunteer/my-listings");
  return response.data;
};

export const createVolunteerListing = async (data) => {
  const response = await api.post("/Volunteer", data);
  return response.data;
};

// SECURITY UPDATE: Removed userId arg
export const applyForVolunteer = async (listingId) => {
  const response = await api.post(`/Volunteer/apply/${listingId}`);
  return response.data;
};

// SECURITY UPDATE: Removed currentUserId arg
export const deleteVolunteerListing = async (listingId) => {
  const response = await api.delete(`/Volunteer/${listingId}`);
  return response.data;
};

// SECURITY UPDATE: Removed currentUserId arg
export const getApplicants = async (listingId) => {
  const response = await api.get(`/Volunteer/applicants/${listingId}`);
  return response.data;
};

// SECURITY UPDATE: Removed ngoId arg
export const getStarTalent = async () => {
  try {
    const response = await api.get("/Volunteer/star-talent");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch star talent:", error);
    throw error;
  }
};