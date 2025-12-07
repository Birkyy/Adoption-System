import axios from "axios";

const API_URL = "http://localhost:5118/api"; 

// --- ARTICLES ---
export const getPendingArticles = async () => {
  const res = await axios.get(`${API_URL}/Articles/admin/pending`);
  return res.data;
};

export const getAllArticles = async () => {
  const res = await axios.get(`${API_URL}/Articles/admin/all`);
  return res.data;
};

export const updateArticleStatus = async (id, status) => {
  const res = await axios.put(`${API_URL}/Articles/admin/status/${id}?status=${status}`);
  return res.data;
};

// --- NGO REQUESTS ---
export const getPendingNgos = async () => {
  const res = await axios.get(`${API_URL}/Users/admin/pending-ngos`);
  return res.data;
};

export const updateUserStatus = async (id, status) => {
  const res = await axios.put(`${API_URL}/Users/admin/status/${id}?status=${status}`);
  return res.data;
};

// --- EVENTS (Moderation) ---
export const getAllEvents = async () => {
  const res = await axios.get(`${API_URL}/Events/admin/all`); 
  return res.data;
};

// New Function for Flagging Events
export const updateEventStatus = async (id, status) => {
  const res = await axios.put(`${API_URL}/Events/admin/status/${id}?status=${status}`);
  return res.data;
};