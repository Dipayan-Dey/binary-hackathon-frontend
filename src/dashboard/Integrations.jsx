import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./styles/DashboardPages.css";

const API_URL =
  import.meta.env.BACKEND_API_ENDPOINT ||
  "https://qm50ddkk06.execute-api.ap-south-1.amazonaws.com/api/v1";

const Integrations = () => {
  const [integrations, setIntegrations] = useState({
    github: { connected: false, username: null },
    linkedin: { connected: false, username: null },
  });

  const [loading, setLoading] = useState(false);
  const [linkedinPostText, setLinkedinPostText] = useState("");
  const [posting, setPosting] = useState(false);
  console.log(integrations);
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

      setIntegrations(
        //   {
        //   github: {
        //     connected: data.data.githubConnected || false,
        //     username: data.data.githubUsername || null,
        //   },
        //   linkedin: {
        //     connected: data.data.linkedinConnected || false,
        //     username: data.data.linkedinId || null,
        //   },
        // }
        data.data.connections,
      );
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
    <div className="dashboard-page">
      <div className="page-header mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">
            🔗 Social Integrations
          </h1>
          <p className="text-gray-300 text-lg">
            Connect your accounts to unlock powerful features
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* GitHub Integration Card */}
        <div
          className={`p-8 rounded-2xl border-2 transition-all shadow-2xl relative overflow-hidden group ${
            integrations.github.connected
              ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-green-400/50 hover:border-green-400"
              : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-white/20 hover:border-white/40"
          }`}
        >
          {/* Background Glow */}
          <div
            className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 transition-all group-hover:opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              integrations.github.connected ? "bg-green-500" : "bg-white"
            }`}
          ></div>

          <div className="flex items-start justify-between mb-6 relative">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-1">GitHub</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">
                  Connect to analyze repositories and track coding skills
                </p>
              </div>
            </div>

            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                integrations.github.connected
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-gray-700/50 text-gray-400 border-gray-600"
              }`}
            >
              {integrations.github.connected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {integrations.github.connected && (
            <div className="mb-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-2">
              <span className="text-green-400 text-sm">👤 Connected as:</span>
              <span className="text-white font-bold text-sm">
                {integrations.github.username}
              </span>
            </div>
          )}

          <div className="relative">
            {integrations.github.connected ? (
              <button
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 text-red-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                onClick={handleDisconnectGithub}
                disabled={loading}
              >
                Disconnect GitHub
              </button>
            ) : (
              <button
                className="w-full py-3 bg-white text-black hover:bg-gray-100 border-2 border-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/20"
                onClick={handleConnectGithub}
                disabled={loading}
              >
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Integration Card */}
        <div
          className={`p-8 rounded-2xl border-2 transition-all shadow-2xl relative overflow-hidden group ${
            integrations.linkedin.connected
              ? "bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-400/50 hover:border-blue-400"
              : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-white/20 hover:border-white/40"
          }`}
        >
          {/* Background Glow */}
          <div
            className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 transition-all group-hover:opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              integrations.linkedin.connected ? "bg-blue-500" : "bg-white"
            }`}
          ></div>

          <div className="flex items-start justify-between mb-6 relative">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-blue-600/30 rounded-xl flex items-center justify-center border border-blue-500/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-blue-400"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-1">LinkedIn</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">
                  Connect to share achievements and grow your network
                </p>
              </div>
            </div>

            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                integrations.linkedin.connected
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-gray-700/50 text-gray-400 border-gray-600"
              }`}
            >
              {integrations.linkedin.connected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {integrations.linkedin.connected && (
            <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center gap-2">
              <span className="text-blue-400 text-sm">👤 Connected as:</span>
              <span className="text-white font-bold text-sm">
                {integrations.linkedin.linkedinId}
              </span>
            </div>
          )}

          <div className="relative">
            {integrations.linkedin.connected ? (
              <button
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 text-red-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                onClick={handleDisconnectLinkedIn}
                disabled={loading}
              >
                Disconnect LinkedIn
              </button>
            ) : (
              <button
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 border-2 border-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30"
                onClick={handleConnectLinkedIn}
                disabled={loading}
              >
                Connect LinkedIn
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LinkedIn Posting Section */}
      {integrations.linkedin.connected && (
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-2 border-blue-500/30 rounded-2xl p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <span>✍️</span> Share to LinkedIn
          </h2>

          <div className="relative z-10">
            <textarea
              value={linkedinPostText}
              onChange={(e) => setLinkedinPostText(e.target.value)}
              placeholder="What do you want to share with your professional network?"
              className="w-full h-32 bg-black/30 border-2 border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none mb-4"
              maxLength={3000}
            />

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">
                {linkedinPostText.length}/3000 characters
              </span>

              <button
                onClick={handleLinkedInPost}
                disabled={posting || !linkedinPostText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                    Post Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-emerald-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-1">
              Secure & Private
            </h4>
            <p className="text-gray-400 text-sm">
              We use industry-standard OAuth 2.0 to securely connect your
              accounts. Your credentials are never stored.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Full Control</h4>
            <p className="text-gray-400 text-sm">
              You maintain specific control over what data is accessed and can
              disconnect instantly at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
