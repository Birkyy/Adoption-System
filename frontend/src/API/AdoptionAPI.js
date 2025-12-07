import axios from "axios";

const BASE_URL = "http://localhost:5118/api";

export const submitAdoptionApplication = async (applicationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Adoptions`, applicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyApplications = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Adoptions/my-applications?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const withdrawApplication = async (appId, userId) => {
  const response = await axios.delete(`${BASE_URL}/Adoptions/${appId}?applicantId=${userId}`);
  return response.data;
};