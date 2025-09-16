import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = (role, credentials) => {
  const endpoint =
    role === "admin" ? "/auth/adminlogin" : "/auth/collaboratorlogin";
  return api.post(endpoint, credentials);
};

// Feedback submit
export const submitFeedback = (formData) => {
  return api.post("/auth/registerFeedback", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Collaborator: Fetch all feedbacks for a developer
export const fetchCollaboratorFeedbacks = (developerId) => {
  return api.get(`/collaborator/feedbacks/${developerId}`);
};

// Collaborator: Update a feedback (progress/status)
export const updateCollaboratorFeedback = async (feedbackId, data) => {
  // Corrected endpoint
  return api.put(`/collaborator/feedbacks/feedbacks/${feedbackId}`, data);
};

export default api;
