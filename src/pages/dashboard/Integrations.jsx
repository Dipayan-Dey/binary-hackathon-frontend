import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./PremiumPages.css";

const API_URL =
  import.meta.env.BACKEND_API_ENDPOINT || "http://localhost:5000/api/v1";

const Integrations = () => {
  const [integrations, setIntegrations] = useState({
    github: { connected: false, username: null },
    linkedin: { connected: false, username: null },
  });
  console.log(integrations);

  const [loading, setLoading] = useState(false);
  const [linkedinPostText, setLinkedinPostText] = useState("");
  const [posting, setPosting] = useState(false);

  // ✅ Fetch profile & integration status
  const fetchIntegrationStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setIntegrations({
        github: {
          connected: data.data.githubConnected || false,
          username: data.data.githubUsername || null,
        },
        linkedin: {
          connected: data.data.linkedinConnected || false,
          username: data.data.linkedinId || null,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // On page load + OAuth callback
  useEffect(() => {
    fetchIntegrationStatus();

    const params = new URLSearchParams(window.location.search);

    if (params.get("github") === "connected") {
      toast.success("GitHub connected successfully!");
      fetchIntegrationStatus();
      window.history.replaceState({}, "", "/dashboard/integrations");
    }

    if (params.get("linkedin") === "connected") {
      toast.success("LinkedIn connected successfully!");
      fetchIntegrationStatus();
      window.history.replaceState({}, "", "/dashboard/integrations");
    }
  }, []);


  const handleConnectGithub = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    window.location.href = `${API_URL}/integrations/github?token=${token}`;
  };

 
  const handleConnectLinkedIn = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    window.location.href = `${API_URL}/integrations/linkedin?token=${token}`;
  };


  const handleDisconnectGithub = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/integrations/github/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("GitHub disconnected successfully!");
      fetchIntegrationStatus();
    } catch (error) {
      toast.error("Failed to disconnect GitHub");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleDisconnectLinkedIn = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/integrations/linkedin/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("LinkedIn disconnected successfully!");
      fetchIntegrationStatus();
    } catch (error) {
      toast.error("Failed to disconnect LinkedIn");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleLinkedInPost = async () => {
    if (!linkedinPostText.trim()) {
      toast.error("Please enter some text to post");
      return;
    }

    try {
      setPosting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/integrations/linkedin/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: linkedinPostText }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Posted to LinkedIn successfully!");
      setLinkedinPostText(""); 
    } catch (error) {
      toast.error(error.message || "Failed to post to LinkedIn");
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="dashboard-page premium-page">
      <div className="page-header">
        <h1 className="page-title">Social Media Integrations</h1>
        <p className="page-subtitle">
          Connect your social media accounts to enhance your profile
        </p>
      </div>

      <div className="integrations-grid">
        {/* GitHub Integration Card */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon github-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="integration-info">
              <h3 className="integration-name">GitHub</h3>
              <p className="integration-description">
                Connect your GitHub account to showcase your repositories
              </p>
            </div>
          </div>

          <div className="integration-status">
            {integrations.github.connected ? (
              <>
                <div className="status-badge status-connected">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Connected
                </div>
                {integrations.github.username && (
                  <p className="connected-username">
                    @{integrations.github.username}
                  </p>
                )}
              </>
            ) : (
              <div className="status-badge status-disconnected">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Not Connected
              </div>
            )}
          </div>

          <div className="integration-actions">
            {integrations.github.connected ? (
              <button
                className="integration-btn disconnect-btn"
                onClick={handleDisconnectGithub}
                disabled={loading}
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
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                Disconnect
              </button>
            ) : (
              <button
                className="integration-btn connect-btn"
                onClick={handleConnectGithub}
                disabled={loading}
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
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Integration Card */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon linkedin-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div className="integration-info">
              <h3 className="integration-name">LinkedIn</h3>
              <p className="integration-description">
                Connect your LinkedIn profile to display your professional
                network
              </p>
            </div>
          </div>

          <div className="integration-status">
            {integrations.linkedin.connected ? (
              <>
                <div className="status-badge status-connected">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Connected
                </div>
                {integrations.linkedin.username && (
                  <p className="connected-username">
                    @{integrations.linkedin.username}
                  </p>
                )}
              </>
            ) : (
              <div className="status-badge status-disconnected">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Not Connected
              </div>
            )}
          </div>

          <div className="integration-actions">
            {integrations.linkedin.connected ? (
              <button
                className="integration-btn disconnect-btn"
                onClick={handleDisconnectLinkedIn}
                disabled={loading}
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
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                Disconnect
              </button>
            ) : (
              <button
                className="integration-btn connect-btn"
                onClick={handleConnectLinkedIn}
                disabled={loading}
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
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
                Connect LinkedIn
              </button>
            )}
          </div>

          {/* LinkedIn Posting Section - Only show when connected */}
          {integrations.linkedin.connected && (
            <div
              className="linkedin-post-section"
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  color: "#fff",
                }}
              >
                Post to LinkedIn
              </h4>
              <textarea
                value={linkedinPostText}
                onChange={(e) => setLinkedinPostText(e.target.value)}
                placeholder="What do you want to share with your network?"
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                  marginBottom: "0.75rem",
                }}
                maxLength={3000}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {linkedinPostText.length}/3000
                </span>
                <button
                  onClick={handleLinkedInPost}
                  disabled={posting || !linkedinPostText.trim()}
                  className="integration-btn connect-btn"
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="integration-info-section">
        <div className="info-card">
          <div className="info-icon">
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
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div className="info-content">
            <h4 className="info-title">Secure OAuth Integration</h4>
            <p className="info-text">
              We use industry-standard OAuth 2.0 to securely connect your
              accounts. Your credentials are never stored on our servers.
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
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
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          <div className="info-content">
            <h4 className="info-title">Full Control</h4>
            <p className="info-text">
              You can disconnect your accounts at any time. We only access the
              data you explicitly authorize.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
