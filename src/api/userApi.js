import axiosClient from "./axiosClient";

// ==========================================
// RESUME MANAGEMENT APIs
// ==========================================

export const uploadResume = (formData) => {
  return axiosClient.post("/profile/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getResume = () => {
  return axiosClient.get("/profile/resume");
};

export const deleteResume = () => {
  return axiosClient.delete("/profile/resume");
};

// ==========================================
// RESUME ANALYSIS APIs
// ==========================================

export const analyzeResume = () => {
  return axiosClient.post("/profile/resume/analyze", {});
};

export const getAnalysisResults = () => {
  return axiosClient.get("/profile/resume/analysis");
};

// ==========================================
// PROFILE MANAGEMENT APIs
// ==========================================

export const getProfile = () => {
  return axiosClient.get("/profile/get-profile");
};

export const updatePersonalInformation = (data) => {
  return axiosClient.put("/profile/update-personal-info", data);
};

export const updateProfile = (data) => {
  return axiosClient.put("/profile/update-full-info", data);
};

export const updateSettings = (data) => {
  return axiosClient.put("/profile/update-settings", data);
};

// ==========================================
// INTERVIEW SYSTEM APIs
// ==========================================

export const startInterview = (data) => {
  return axiosClient.post("/interviews/start", data);
};

export const submitInterviewAnswer = (sessionId, data) => {
  return axiosClient.post(`/interviews/${sessionId}/answer`, data);
};

export const completeInterview = (sessionId) => {
  return axiosClient.post(`/interviews/${sessionId}/complete`, {});
};

export const getInterviewHistory = (page = 1, limit = 10) => {
  return axiosClient.get(`/interviews/history?page=${page}&limit=${limit}`);
};

export const deleteInterview = (sessionId) => {
  return axiosClient.delete(`/interviews/${sessionId}`);
};

// ==========================================
// QUIZ SYSTEM APIs
// ==========================================

export const generateQuiz = (data) => {
  return axiosClient.post("/quizzes/generate", data);
};

export const startQuiz = (data) => {
  return axiosClient.post("/quizzes/start", data);
};

export const submitQuizAnswers = (sessionId, data) => {
  return axiosClient.post(`/quizzes/${sessionId}/submit`, data);
};

export const getQuizHistory = (page = 1, limit = 10) => {
  return axiosClient.get(`/quizzes/history?page=${page}&limit=${limit}`);
};

export const chatbotService = {
  // Send message to chatbot
  sendMessage: async (message) => {
    const response = await axiosClient.post("/chatbot/message", {
      message,
    });
    return response.data;
  },
};