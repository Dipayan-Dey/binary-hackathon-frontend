import React from "react";
import "./PremiumPages.css";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      status: "In Progress",
      progress: 75,
      team: 4,
      color: "primary",
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "In Progress",
      progress: 45,
      team: 6,
      color: "success",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      status: "Completed",
      progress: 100,
      team: 3,
      color: "success",
    },
    {
      id: 4,
      name: "Database Migration",
      status: "Pending",
      progress: 20,
      team: 2,
      color: "warning",
    },
    {
      id: 5,
      name: "API Integration",
      status: "In Progress",
      progress: 60,
      team: 5,
      color: "primary",
    },
  ];

  return (
    <div className="dashboard-page premium-page">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Manage and track your ongoing projects</p>
      </div>

      <div className="projects-grid">
        {/* Add New Project Card */}
        <div className="project-card add-project-card">
          <div className="add-project-icon">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h3 className="add-project-text">Create New Project</h3>
        </div>

        {/* Project Cards */}
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card project-card-${project.color}`}
          >
            <div className="project-header">
              <h3 className="project-name">{project.name}</h3>
              <span
                className={`project-status status-${project.status.toLowerCase().replace(" ", "-")}`}
              >
                {project.status}
              </span>
            </div>

            <div className="project-progress">
              <div className="progress-info">
                <span className="progress-label">Progress</span>
                <span className="progress-percentage">{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="project-footer">
              <div className="project-team">
                <div className="team-avatars">
                  {[...Array(Math.min(project.team, 3))].map((_, i) => (
                    <div
                      key={i}
                      className="team-avatar"
                      style={{ zIndex: 3 - i }}
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
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  ))}
                  {project.team > 3 && (
                    <div className="team-avatar team-avatar-more">
                      +{project.team - 3}
                    </div>
                  )}
                </div>
                <span className="team-count">{project.team} members</span>
              </div>
              <button className="project-action-btn">
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
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
