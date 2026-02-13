import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchGithubRepos,
  analyzeRepository,
  getUserProjects,
  getUserSkills,
  getUserProfile,
} from "../api/github";
import { useDebounce } from "../hooks/useDebounce";
import { useURLParams } from "../hooks/useURLParams";
import AllRepositories from "./reports/AllRepositories";
import AnalyzedProjects from "./reports/AnalyzedProjects";
import SkillsEvaluation from "./reports/SkillsEvaluation";
import "./styles/PremiumPages.css";
import "./styles/BrightColors.css";

const Reports = () => {
  const navigate = useNavigate();
  const { search, setSearch, page, setPage } = useURLParams();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Repositories state
  const [repos, setRepos] = useState([]);
  const [reposPage, setReposPage] = useState(1);
  const [reposTotalPages, setReposTotalPages] = useState(1);
  const [reposSearch, setReposSearch] = useState("");
  const [reposTotalCount, setReposTotalCount] = useState(0);

  // Analyzed Projects state
  const [analyzedProjects, setAnalyzedProjects] = useState([]);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  const [projectsSearch, setProjectsSearch] = useState("");
  const [projectsTotalCount, setProjectsTotalCount] = useState(0);

  // Skills state
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [skillsPage, setSkillsPage] = useState(1);
  const [skillsTotalPages, setSkillsTotalPages] = useState(1);
  const [skillsSearch, setSkillsSearch] = useState("");
  const [skillsTotalCount, setSkillsTotalCount] = useState(0);

  const [selectedRepo, setSelectedRepo] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [analyzedRepos, setAnalyzedRepos] = useState(new Set());

  // Tab state
  const [activeTab, setActiveTab] = useState("repos");

  // Language and visibility filters
  const [languageFilter, setLanguageFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Debounced search values
  const debouncedReposSearch = useDebounce(reposSearch, 500);
  const debouncedProjectsSearch = useDebounce(projectsSearch, 500);
  const debouncedSkillsSearch = useDebounce(skillsSearch, 500);

  // Check GitHub connection status
  useEffect(() => {
    checkGithubConnection();
  }, []);

  // Load data when debounced search changes
  useEffect(() => {
    if (githubConnected) {
      setReposPage(1);
      loadRepositories(1, debouncedReposSearch, true);
    }
  }, [debouncedReposSearch]);

  useEffect(() => {
    if (githubConnected && activeTab === "analyzed") {
      setProjectsPage(1);
      loadAnalyzedProjects(1, debouncedProjectsSearch, true);
    }
  }, [debouncedProjectsSearch]);

  useEffect(() => {
    if (githubConnected && activeTab === "skills") {
      setSkillsPage(1);
      fetchSkillsData(1, debouncedSkillsSearch, true);
    }
  }, [debouncedSkillsSearch]);

  const checkGithubConnection = async () => {
    try {
      const data = await getUserProfile();

      if (data.data.githubConnected) {
        setGithubConnected(true);
        loadRepositories();
        loadAnalyzedProjects();
        fetchSkillsData();
      } else {
        setGithubConnected(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
      setLoading(false);
    }
  };

  const loadRepositories = async (
    pageNum = 1,
    searchTerm = "",
    reset = false,
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchGithubRepos(pageNum, 10, searchTerm);

      if (reset || pageNum === 1) {
        setRepos(response.repos || []);
      } else {
        setRepos((prev) => [...prev, ...(response.repos || [])]);
      }

      setReposTotalPages(response.totalPages || 1);
      setReposTotalCount(response.totalRecords || 0);
      setReposPage(pageNum);
    } catch (error) {
      toast.error(error.message || "Failed to load repositories");
      if (error.message.includes("not connected")) {
        setTimeout(() => navigate("/dashboard/integrations"), 1500);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadAnalyzedProjects = async (
    pageNum = 1,
    searchTerm = "",
    reset = false,
  ) => {
    try {
      if (pageNum === 1 && reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await getUserProjects(pageNum, 10, searchTerm);

      if (reset || pageNum === 1) {
        setAnalyzedProjects(data.data || []);
        // Populate analyzed repos set
        const analyzedRepoNames = (data.data || []).map(
          (project) => project.repoFullName,
        );
        setAnalyzedRepos(new Set(analyzedRepoNames));
      } else {
        setAnalyzedProjects((prev) => [...prev, ...(data.data || [])]);
        // Update analyzed repos set
        const newRepoNames = (data.data || []).map(
          (project) => project.repoFullName,
        );
        setAnalyzedRepos((prev) => new Set([...prev, ...newRepoNames]));
      }

      setProjectsTotalPages(data.totalPages || 1);
      setProjectsTotalCount(data.totalRecords || 0);
      setProjectsPage(pageNum);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchSkillsData = async (
    pageNum = 1,
    searchTerm = "",
    reset = false,
  ) => {
    try {
      if (pageNum === 1 && reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await getUserSkills(pageNum, 10, searchTerm);

      if (reset || pageNum === 1) {
        setExtractedSkills(data.skills || data.data || []);
      } else {
        setExtractedSkills((prev) => [
          ...prev,
          ...(data.skills || data.data || []),
        ]);
      }

      setSkillsTotalPages(data.totalPages || 1);
      setSkillsTotalCount(data.totalRecords || 0);
      setSkillsPage(pageNum);
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleAnalyzeRepo = async (repoFullName) => {
    try {
      setAnalyzing(true);
      setSelectedRepo(repoFullName);

      const response = await analyzeRepository(repoFullName);

      if (response.message === "Repository already analyzed") {
        toast.info("This repository has already been analyzed!");
      } else {
        toast.success("Repository analyzed & skills evaluated successfully!");
      }

      // Reload analyzed projects and skills
      await loadAnalyzedProjects(1, projectsSearch, true);
      await fetchSkillsData(1, skillsSearch, true);

      // Add to analyzed set
      setAnalyzedRepos((prev) => new Set([...prev, repoFullName]));

      // Switch to analyzed tab
      setActiveTab("analyzed");
    } catch (error) {
      toast.error(error.message || "Failed to analyze repository");
    } finally {
      setAnalyzing(false);
      setSelectedRepo(null);
    }
  };

  // Infinite scroll handlers
  const loadMoreRepos = useCallback(() => {
    if (reposPage < reposTotalPages && !loadingMore) {
      loadRepositories(reposPage + 1, debouncedReposSearch, false);
    }
  }, [reposPage, reposTotalPages, loadingMore, debouncedReposSearch]);

  const loadMoreProjects = useCallback(() => {
    if (projectsPage < projectsTotalPages && !loadingMore) {
      loadAnalyzedProjects(projectsPage + 1, debouncedProjectsSearch, false);
    }
  }, [projectsPage, projectsTotalPages, loadingMore, debouncedProjectsSearch]);

  const loadMoreSkills = useCallback(() => {
    if (skillsPage < skillsTotalPages && !loadingMore) {
      fetchSkillsData(skillsPage + 1, debouncedSkillsSearch, false);
    }
  }, [skillsPage, skillsTotalPages, loadingMore, debouncedSkillsSearch]);

  if (
    loading &&
    repos.length === 0 &&
    analyzedProjects.length === 0 &&
    extractedSkills.length === 0
  ) {
    return (
      <div className="reports-page">
        <div className="reports-container">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!githubConnected) {
    return (
      <div className="reports-page">
        <div className="reports-container">
          <div className="text-center py-20">
            <h2 className="text-white text-2xl font-bold mb-4">
              🔗 Connect GitHub
            </h2>
            <p className="text-gray-300 mb-6">
              Connect your GitHub account to view and analyze your repositories
            </p>
            <button
              onClick={() => navigate("/dashboard/integrations")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Integrations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="reports-header">
          <div>
            <h1 className="text-white text-3xl font-bold">GitHub Reports</h1>
            <p className="text-gray-300 mt-2">
              Analyze your repositories and track your skills
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Repositories */}
          <div className="bg-gradient-to-br from-sky-400/40 to-blue-600/40 rounded-2xl border-2 border-sky-300/60 p-6 hover:border-sky-300 hover:from-sky-400/50 hover:to-blue-600/50 transition-all shadow-2xl hover:shadow-sky-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-100 text-sm font-bold mb-2">
                  Total Repositories
                </p>
                <p className="text-white text-5xl font-bold drop-shadow-lg">
                  {reposTotalCount > 0 ? reposTotalCount : repos.length}
                </p>
              </div>
              <div className="text-7xl opacity-20">📦</div>
            </div>
          </div>

          {/* Analyzed Projects */}
          <div className="bg-gradient-to-br from-emerald-400/40 to-teal-600/40 rounded-2xl border-2 border-emerald-300/60 p-6 hover:border-emerald-300 hover:from-emerald-400/50 hover:to-teal-600/50 transition-all shadow-2xl hover:shadow-emerald-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-bold mb-2">
                  Analyzed Projects
                </p>
                <p className="text-white text-5xl font-bold drop-shadow-lg">
                  {projectsTotalCount > 0
                    ? projectsTotalCount
                    : analyzedProjects.length}
                </p>
              </div>
              <div className="text-7xl opacity-20">📊</div>
            </div>
          </div>

          {/* Skills Extracted */}
          <div className="bg-gradient-to-br from-fuchsia-400/40 to-purple-600/40 rounded-2xl border-2 border-fuchsia-300/60 p-6 hover:border-fuchsia-300 hover:from-fuchsia-400/50 hover:to-purple-600/50 transition-all shadow-2xl hover:shadow-fuchsia-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-fuchsia-100 text-sm font-bold mb-2">
                  Skills Evaluated
                </p>
                <p className="text-white text-5xl font-bold drop-shadow-lg">
                  {skillsTotalCount > 0
                    ? skillsTotalCount
                    : extractedSkills.length}
                </p>
              </div>
              <div className="text-7xl opacity-20">✨</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="reports-tabs">
          <button
            className={`tab ${activeTab === "repos" ? "active" : ""}`}
            onClick={() => setActiveTab("repos")}
          >
            Repositories ({repos.length})
          </button>
          <button
            className={`tab ${activeTab === "analyzed" ? "active" : ""}`}
            onClick={() => setActiveTab("analyzed")}
          >
            Analyzed ({analyzedProjects.length})
          </button>
          <button
            className={`tab ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            Skills ({extractedSkills.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="reports-content">
          {activeTab === "repos" && (
            <AllRepositories
              repos={repos}
              handleAnalyzeRepo={handleAnalyzeRepo}
              analyzing={analyzing}
              selectedRepo={selectedRepo}
              searchQuery={reposSearch}
              setSearchQuery={setReposSearch}
              languageFilter={languageFilter}
              setLanguageFilter={setLanguageFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              analyzedRepos={analyzedRepos}
              loadMore={loadMoreRepos}
              hasMore={reposPage < reposTotalPages}
              loadingMore={loadingMore}
            />
          )}

          {activeTab === "analyzed" && (
            <AnalyzedProjects
              analyzedProjects={analyzedProjects}
              searchQuery={projectsSearch}
              setSearchQuery={setProjectsSearch}
              loadMore={loadMoreProjects}
              hasMore={projectsPage < projectsTotalPages}
              loadingMore={loadingMore}
            />
          )}

          {activeTab === "skills" && (
            <SkillsEvaluation
              extractedSkills={extractedSkills}
              searchQuery={skillsSearch}
              setSearchQuery={setSkillsSearch}
              loadMore={loadMoreSkills}
              hasMore={skillsPage < skillsTotalPages}
              loadingMore={loadingMore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
