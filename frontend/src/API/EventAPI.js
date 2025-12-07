import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

export const getPublicEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Events`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- NEW: Get Single Event ---
export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEventProposal = async (eventData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Events`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (id, eventData, userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/Events/${id}?currentUserId=${userId}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- NEW: Join Event ---
export const joinEvent = async (eventId, userId) => {
  try {
    // Backend expects userId as a query parameter: /join/{id}?userId=...
    const response = await axios.post(`${BASE_URL}/Events/join/${eventId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllNgos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Users/ngos`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getMyEvents = async (userId) => {
  const response = await axios.get(`${BASE_URL}/Events/my-events?userId=${userId}`);
  return response.data;
};

export const deleteEvent = async (eventId, userId) => {
  const response = await axios.delete(`${BASE_URL}/Events/${eventId}?currentUserId=${userId}`);
  return response.data;
};

