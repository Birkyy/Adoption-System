import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

export const getVolunteerListings = async () => {
  const response = await axios.get(`${BASE_URL}/Volunteer`);
  return response.data;
};

export const getMyVolunteerListings = async (ngoId) => {
  const response = await axios.get(`${BASE_URL}/Volunteer/my-listings?ngoId=${ngoId}`);
  return response.data;
};

export const createVolunteerListing = async (data) => {
  const response = await axios.post(`${BASE_URL}/Volunteer`, data);
  return response.data;
};

export const applyForVolunteer = async (listingId, userId) => {
  const response = await axios.post(`${BASE_URL}/Volunteer/apply/${listingId}?userId=${userId}`);
  return response.data;
};

export const deleteVolunteerListing = async (listingId, currentUserId) => {
  const response = await axios.delete(`${BASE_URL}/Volunteer/${listingId}?currentUserId=${currentUserId}`);
  return response.data;
};

export const getApplicants = async (listingId, currentUserId) => {
  const response = await axios.get(`${BASE_URL}/Volunteer/applicants/${listingId}?currentUserId=${currentUserId}`);
  return response.data;
};

export const getStarTalent = async (ngoId) => {
  try {
    const response = await axios.get(`${BASE_URL}/star-talent/${ngoId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch star talent:", error);
    throw error;
  }
};