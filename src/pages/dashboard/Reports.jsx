import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchGithubRepos,
  analyzeRepository,
  generateSkills,
  getUserProjects,
  getUserSkills,
  getUserProfile,
} from "../../api/github";
import "./PremiumPages.css";

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [analyzedProjects, setAnalyzedProjects] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  console.log(analyzedProjects);
  // Tab state
  const [activeTab, setActiveTab] = useState("repos"); // repos, analyzed, skills

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // all, public, private

  // Check GitHub connection status
  useEffect(() => {
    checkGithubConnection();
  }, []);

  // Filter repos when search/filter changes
  useEffect(() => {
    filterRepositories();
  }, [searchQuery, languageFilter, visibilityFilter, repos]);

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
        // setTimeout(() => {
        //   toast.info("Please connect your GitHub account first");
        //   navigate("/dashboard/integrations");
        // }, 2000);
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
      setLoading(false);
    }
  };

  const loadRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetchGithubRepos();
      setRepos(response.data || []);
      setFilteredRepos(response.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load repositories");
      if (error.message.includes("not connected")) {
        setTimeout(() => navigate("/dashboard/integrations"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyzedProjects = async () => {
    try {
      const data = await getUserProjects();
      setAnalyzedProjects(data.data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const fetchSkillsData = async () => {
    try {
      const data = await getUserSkills();
      console.log("Fetched skills:", data.data);
      setExtractedSkills(data.data || []);
    } catch (error) {
      console.error("Error loading skills:", error);
    }
  };

  const filterRepositories = () => {
    let filtered = [...repos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Language filter
    if (languageFilter !== "all") {
      filtered = filtered.filter((repo) => repo.language === languageFilter);
    }

    // Visibility filter
    if (visibilityFilter !== "all") {
      filtered = filtered.filter((repo) =>
        visibilityFilter === "private" ? repo.private : !repo.private,
      );
    }

    setFilteredRepos(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleAnalyzeRepo = async (repoFullName) => {
    try {
      setAnalyzing(true);
      setSelectedRepo(repoFullName);

      const projectResponse = await analyzeRepository(repoFullName);
      toast.success("Repository analyzed successfully!");

      const skillResponse = await generateSkills();
      toast.success("Skills generated successfully!");

      // Reload analyzed projects and skills
      await loadAnalyzedProjects();
      await fetchSkillsData();

      // Switch to analyzed tab
      setActiveTab("analyzed");
    } catch (error) {
      toast.error(error.message || "Analysis failed");
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
      setSelectedRepo(null);
    }
  };

  // Get unique languages for filter
  const uniqueLanguages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="dashboard-page premium-page">
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="spinner"></div>
          <p style={{ color: "#fff" }}>Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (!githubConnected) {
    return (
      <div className="dashboard-page premium-page">
        <div className="page-header">
          <h1 className="page-title">GitHub Repository Analysis</h1>
          <p className="page-subtitle">Redirecting to integrations...</p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1rem",
              color: "#6366f1",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
          <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
            GitHub Not Connected
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Please connect your GitHub account to view repository analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page premium-page">
      <div className="page-header">
        <h1 className="page-title">GitHub Repository Analysis</h1>
        <p className="page-subtitle">Analyze repositories and extract skills</p>
      </div>

      {/* Summary Stats */}
      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-icon summary-icon-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Total Repositories</p>
            <h3 className="summary-value">{repos.length}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon summary-icon-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Analyzed Projects</p>
            <h3 className="summary-value">{analyzedProjects.length}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon summary-icon-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Skills Extracted</p>
            <h3 className="summary-value">{extractedSkills.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "0",
        }}
      >
        <button
          onClick={() => setActiveTab("repos")}
          style={{
            background: activeTab === "repos" ? "#667eea" : "transparent",
            border: "none",
            borderBottom:
              activeTab === "repos"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color: activeTab === "repos" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          📦 Repositories ({repos.length})
        </button>
        <button
          onClick={() => setActiveTab("analyzed")}
          style={{
            background:
              activeTab === "analyzed"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "analyzed"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color:
              activeTab === "analyzed" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          📊 Analyzed ({analyzedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          style={{
            background:
              activeTab === "skills"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "skills"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color: activeTab === "skills" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          ✨ Skills ({extractedSkills.length})
        </button>
      </div>

      {/* Repositories Tab */}
      {activeTab === "repos" && (
        <>
          {/* Search and Filters */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div style={{ flex: "1", minWidth: "250px" }}>
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <option value="all">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang} className="text-black">
                  {lang}
                </option>
              ))}
            </select>

            {/* Visibility Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <option value="all" className="text-black">
                All Repos
              </option>
              <option value="public" className="text-black">
                Public Only
              </option>
              <option value="private" className="text-black">
                Private Only
              </option>
            </select>

            {/* Refresh Button */}
            <button
              className="generate-report-btn"
              onClick={loadRepositories}
              disabled={loading}
              style={{ marginLeft: "auto" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Repository List */}
          <div className="reports-list">
            {currentRepos.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <p>No repositories found</p>
              </div>
            ) : (
              currentRepos.map((repo) => (
                <div key={repo.fullName} className="report-card">
                  <div className="report-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375"
                      />
                    </svg>
                  </div>

                  <div className="report-info">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <h4 className="report-title">
                        <a href={repo.url}>{repo.name}</a>
                      </h4>
                      {repo.private ? (
                        <span
                          style={{
                            background: "rgba(234, 179, 8, 0.2)",
                            color: "#fbbf24",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          🔒 Private
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(53, 234, 8, 0.45)",
                            color: "#fdfdfdff",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          🔓 Public
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255, 255, 255, 0.6)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {repo.description || "No description"}
                    </p>
                    <div className="report-meta">
                      <span
                        className="report-type"
                        style={{
                          background: repo.language
                            ? "rgba(99, 102, 241, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                          color: repo.language
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {repo.language || "Unknown"}
                      </span>
                      {/* <span className="report-separator">•</span>
                      <span className="report-size">⭐ {repo.stars || 0}</span> */}
                    </div>
                  </div>

                  <div className="report-actions">
                    <button
                      className="download-btn"
                      onClick={() => handleAnalyzeRepo(repo.fullName)}
                      disabled={analyzing && selectedRepo === repo.fullName}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5"
                        />
                      </svg>
                      {analyzing && selectedRepo === repo.fullName
                        ? "Analyzing..."
                        : "Analyze"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "2rem",
              }}
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "0.5rem 1rem",
                  background:
                    currentPage === 1
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(99, 102, 241, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  color:
                    currentPage === 1 ? "rgba(255, 255, 255, 0.3)" : "#fff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  style={{
                    padding: "0.5rem 1rem",
                    background:
                      currentPage === index + 1
                        ? "#6366f1"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: currentPage === index + 1 ? "600" : "400",
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "0.5rem 1rem",
                  background:
                    currentPage === totalPages
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(99, 102, 241, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  color:
                    currentPage === totalPages
                      ? "rgba(255, 255, 255, 0.3)"
                      : "#fff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Analyzed Projects Tab */}
      {activeTab === "analyzed" && (
        <div className="reports-list">
          {analyzedProjects.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <p>
                No analyzed projects yet. Analyze a repository to see it here.
              </p>
            </div>
          ) : (
            analyzedProjects.map((project) => (
              <div
                key={project._id}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: "1rem" }}>
                  📊 {project.repoName}
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Primary Language
                    </p>
                    <p
                      style={{
                        color: "#818cf8",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {project.primaryLanguage}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Total Commits
                    </p>
                    <p
                      style={{
                        color: "#10b981",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {project.totalCommits}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Last Commit
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {project.lastCommitDate
                        ? new Date(project.lastCommitDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Analyzed
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {new Date(project.analyzedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#6366f1",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  View on GitHub →
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Extracted Skills Tab */}
      {activeTab === "skills" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {extractedSkills.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <p>
                No skills extracted yet. Analyze a repository to extract skills.
              </p>
            </div>
          ) : (
            extractedSkills.map((skill) => (
              <div
                key={skill._id}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
                  borderRadius: "12px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  padding: "1.5rem",
                }}
              >
                <h4
                  style={{
                    color: "#fff",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  ✨ {skill.skillName}
                </h4>
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.85rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Proficiency Level
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(99, 102, 241, 0.2)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        color: "#818cf8",
                        fontWeight: "600",
                      }}
                    >
                      Level {skill.level}/5
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "rgba(255, 255, 255, 0.1)",
                        height: "8px",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(skill.level / 5) * 100}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Confidence
                    </p>
                    <p
                      style={{
                        color: "#10b981",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {(skill.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Source
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {skill.source}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
