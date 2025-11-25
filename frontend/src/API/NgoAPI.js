import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

// --- PETS ---
export const createPet = async (petData) => {
  const response = await axios.post(`${BASE_URL}/Pets`, petData);
  return response.data;
};

export const getAllPets = async () => {
  const response = await axios.get(`${BASE_URL}/Pets`);
  return response.data;
};

export const deletePet = async (petId, currentUserId) => {
  const response = await axios.delete(`${BASE_URL}/Pets/${petId}?currentUserId=${currentUserId}`);
  return response.data;
};

// --- ADOPTIONS ---
export const getNgoApplications = async (ngoId) => {
  const response = await axios.get(`${BASE_URL}/Adoptions/ngo-applications?ngoId=${ngoId}`);
  return response.data;
};

export const updateAdoptionStatus = async (id, status, ngoId) => {
  const response = await axios.put(`${BASE_URL}/Adoptions/status/${id}?status=${status}&ngoId=${ngoId}`);
  return response.data;
};

// --- EVENTS ---
export const getMyEvents = async (userId) => {
  const response = await axios.get(`${BASE_URL}/Events/my-events?userId=${userId}`);
  return response.data;
};

export const getPendingProposals = async (ngoId) => {
  const response = await axios.get(`${BASE_URL}/Events/pending?ngoId=${ngoId}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(`${BASE_URL}/Events`, eventData);
  return response.data;
};

export const approveProposal = async (eventId, ngoId, status) => {
  const response = await axios.put(`${BASE_URL}/Events/approve/${eventId}?ngoId=${ngoId}&status=${status}`);
  return response.data;
};

export const rejectProposal = async (eventId, ngoId, status) => {
  const response = await axios.put(`${BASE_URL}/Events/reject/${eventId}?ngoId=${ngoId}&status=${status}`);
  return response.data;
};

// --- ARTICLES ---
export const getMyArticles = async (authorId) => {
  const response = await axios.get(`${BASE_URL}/Articles/my-articles?authorId=${authorId}`);
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await axios.post(`${BASE_URL}/Articles`, articleData);
  return response.data;
};