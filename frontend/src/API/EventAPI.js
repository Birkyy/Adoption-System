import api from "./axiosInstance";

export const getPublicEvents = async () => {
  try {
    const response = await api.get("/Events");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/Events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEventProposal = async (eventData) => {
  try {
    const response = await api.post("/Events", eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (id, eventData, userId) => {
  try {
    const response = await api.put(`/Events/${id}?currentUserId=${userId}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinEvent = async (eventId, userId) => {
  try {
    const response = await api.post(`/Events/join/${eventId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllNgos = async () => {
  try {
    const response = await api.get("/Users/ngos");
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getMyEvents = async (userId) => {
  const response = await api.get(`/Events/my-events?userId=${userId}`);
  return response.data;
};

export const deleteEvent = async (eventId, userId) => {
  const response = await api.delete(`/Events/${eventId}?currentUserId=${userId}`);
  return response.data;
};