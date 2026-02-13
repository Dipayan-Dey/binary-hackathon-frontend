
import axiosClient from "./axiosClient";

export const fetchGithubRepos = async (page = 1, limit = 10, search = "") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }


    const response = await axiosClient.get(
      `/integrations/github/repos?${params.toString()}`,
    );
    

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

export const getUserProjects = async (page = 1, limit = 10, search = "") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }


    const response = await axiosClient.get(
      `/integrations/github/projects?${params.toString()}`,
    );
    

    return response.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch projects",
    );
  }
};


export const getUserSkills = async (page = 1, limit = 10, search = "") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }


    const response = await axiosClient.get(`/integrations/github/skills/all?${params.toString()}`);
    

    return response.data;
  } catch (error) {
    console.error("Error fetching user skills:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch skills");
  }
};

export const generateSkills = async (projectId) => {
  try {
    const response = await axiosClient.post("/integrations/github/skills", { projectId });
    return response.data;
  } catch (error) {
    console.error("Error generating skills:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate skills",
    );
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get("/user/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};
