import api from "./axiosInstance";

// --- PETS ---
export const createPet = async (petData) => {
  const response = await api.post("/Pets", petData);
  return response.data;
};

export const getAllPets = async (params = {}) => {
  try {
    // This allows us to ask for { pageSize: 100 }
    const response = await api.get("/Pets", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEnrichedAdoptions = async () => {
  try {
    const response = await api.get(`/Adoptions/enriched-list/${user.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePet = async (petId, currentUserId) => {
  const response = await api.delete(`/Pets/${petId}?currentUserId=${currentUserId}`);
  return response.data;
};

// --- ADOPTIONS ---
export const getNgoApplications = async (ngoId) => {
  const response = await api.get(`/Adoptions/ngo-applications?ngoId=${ngoId}`);
  return response.data;
};

export const updateAdoptionStatus = async (id, status, ngoId) => {
  const response = await api.put(`/Adoptions/status/${id}?status=${status}&ngoId=${ngoId}`);
  return response.data;
};

// --- EVENTS ---
export const getMyEvents = async (userId) => {
  const response = await api.get(`/Events/my-events?userId=${userId}`);
  return response.data;
};

export const getPendingProposals = async (ngoId) => {
  const response = await api.get(`/Events/pending?ngoId=${ngoId}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post("/Events", eventData);
  return response.data;
};

export const approveProposal = async (eventId, ngoId, status) => {
  const response = await api.put(`/Events/approve/${eventId}?ngoId=${ngoId}&status=${status}`);
  return response.data;
};

export const rejectProposal = async (eventId, ngoId, status) => {
  const response = await api.put(`/Events/reject/${eventId}?ngoId=${ngoId}&status=${status}`);
  return response.data;
};

export const deleteEvent = async (eventId, userId) => {
  const response = await api.delete(`/Events/${eventId}?currentUserId=${userId}`);
  return response.data;
};

// --- ARTICLES ---
export const getMyArticles = async (authorId) => {
  const response = await api.get(`/Articles/my-articles?authorId=${authorId}`);
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await api.post("/Articles", articleData);
  return response.data;
};