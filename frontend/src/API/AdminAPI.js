import api from "./axiosInstance";

// --- ARTICLES ---
export const getPendingArticles = async () => {
  const res = await api.get("/Articles/admin/pending");
  return res.data;
};

export const getAllArticles = async () => {
  const res = await api.get("/Articles/admin/all");
  return res.data;
};

export const updateArticleStatus = async (id, status) => {
  const res = await api.put(`/Articles/admin/status/${id}?status=${status}`);
  return res.data;
};

// --- NGO REQUESTS ---
export const getPendingNgos = async () => {
  const res = await api.get("/Users/admin/pending-ngos");
  return res.data;
};

export const updateUserStatus = async (id, status) => {
  const res = await api.put(`/Users/admin/status/${id}?status=${status}`);
  return res.data;
};

// --- EVENTS (Moderation) ---
export const getAllEvents = async () => {
  const res = await api.get("/Events/admin/all");
  return res.data;
};

export const updateEventStatus = async (id, status) => {
  const res = await api.put(`/Events/admin/status/${id}?status=${status}`);
  return res.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};