import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://readynx-backend-ts.onrender.com/api/v1", 
});

// Auto attach token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
