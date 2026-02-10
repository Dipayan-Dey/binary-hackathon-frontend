import axios from "axios";
import axiosClient from "./axiosClient";
// Create axios instance with base URL
// const axiosClient = axios.create({
//   baseURL: import.meta.env.BACKEND_API_ENDPOINT || "https://readynx-backend-ts.onrender.com/api/v1",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// Add auth token to requests
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// Response interceptor for error handling
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

export const fetchGithubRepos = async () => {
  try {
    const response = await axiosClient.get("/integrations/github/repos");
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch repositories",
    );
  }
};

export const analyzeRepository = async (repoFullName) => {
  try {
    const response = await axiosClient.post("/integrations/github/analyze", {
      repoFullName,
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing repository:", error);
    throw new Error(
      error.response?.data?.message || "Failed to analyze repository",
    );
  }
};

export const generateSkills = async () => {
  try {
    const response = await axiosClient.post("/integrations/github/skills");
    return response.data;
  } catch (error) {
    console.error("Error generating skills:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate skills",
    );
  }
};

export const getUserProjects = async () => {
  try {
    const response = await axiosClient.get("/user/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch projects",
    );
  }
};

export const getUserSkills = async () => {
  try {
    const response = await axiosClient.get("/user/skills");
    return response.data;
  } catch (error) {
    console.error("Error fetching user skills:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch skills");
  }
};

/**
 * Get user profile information
 * @returns {Promise<Object>} Response with user data
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get("/user/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

/**
 * Complete workflow: Analyze repository and generate skills
 * @param {string} repoFullName - Full repository name (e.g., "username/repo")
 * @returns {Promise<Object>} Response with both project and skill data
 */
export const analyzeAndGenerateSkills = async (repoFullName) => {
  try {
    // Step 1: Analyze repository
    const projectData = await analyzeRepository(repoFullName);

    // Step 2: Generate skills from analyzed project
    const skillData = await generateSkills();

    return {
      success: true,
      project: projectData.data,
      skill: skillData.data,
    };
  } catch (error) {
    console.error("Error in analyze and generate workflow:", error);
    throw error;
  }
};

// export default axiosClient;
