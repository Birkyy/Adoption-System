import api from "./axiosInstance";

export const submitAdoptionApplication = async (applicationData) => {
  try {
    const response = await api.post("/Adoptions", applicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyApplications = async (userId) => {
  try {
    // Note: If you want to secure this further, you could remove 'userId' from the query 
    // and extract it from the Token on the backend instead! 
    // For now, we keep it as is.
    const response = await api.get(`/Adoptions/my-applications?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const withdrawApplication = async (appId, userId) => {
  try {
    const response = await api.delete(`/Adoptions/${appId}?applicantId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};