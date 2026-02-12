import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  fetchGithubRepos,
  getUserProjects,
  getUserSkills,
} from "../api/github";
import "./DashboardPages.css";
import "./BrightColors.css";

const Overview = ({ profile }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRepos: 0,
    analyzedProjects: 0,
    skillsEvaluated: 0,
    githubConnected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [reposData, projectsData, skillsData] = await Promise.all([
        fetchGithubRepos(1, 5).catch(() => ({ totalRecords: 0 })),
        getUserProjects(1, 5).catch(() => ({ totalRecords: 0 })),
        getUserSkills(1, 5).catch(() => ({ totalRecords: 0 })),
      ]);

      setStats({
        totalRepos: reposData.totalRecords || 0,
        analyzedProjects: projectsData.totalRecords || 0,
        skillsEvaluated: skillsData.totalRecords || 0,
        githubConnected: profile?.data?.githubConnected || false,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <div className="page-header mb-8">
        <div>
          <h1 className="text-white text-4xl font-bold mb-2">
            👋 Welcome back,{" "}
            {profile?.data?.user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-300 text-lg">
            Here's an overview of your development journey
          </p>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Repositories */}
        <div
          className="bg-gradient-to-br from-sky-400/40 to-blue-600/40 rounded-2xl border-2 border-sky-300/60 p-6 hover:border-sky-300 hover:from-sky-400/50 hover:to-blue-600/50 transition-all shadow-2xl hover:shadow-sky-500/50 cursor-pointer"
          onClick={() => navigate("/dashboard/reports")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-sky-400/30 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400"></div>
            ) : (
              <span className="text-sky-100 text-sm font-semibold">
                View All →
              </span>
            )}
          </div>
          <p className="text-sky-100 text-sm font-semibold mb-1">
            Total Repositories
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-lg">
            {stats.totalRepos}
          </p>
        </div>

        {/* Analyzed Projects */}
        <div
          className="bg-gradient-to-br from-emerald-400/40 to-teal-600/40 rounded-2xl border-2 border-emerald-300/60 p-6 hover:border-emerald-300 hover:from-emerald-400/50 hover:to-teal-600/50 transition-all shadow-2xl hover:shadow-emerald-500/50 cursor-pointer"
          onClick={() => navigate("/dashboard/reports")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-emerald-400/30 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
            ) : (
              <span className="text-emerald-100 text-sm font-semibold">
                View All →
              </span>
            )}
          </div>
          <p className="text-emerald-100 text-sm font-semibold mb-1">
            Analyzed Projects
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-lg">
            {stats.analyzedProjects}
          </p>
        </div>

        {/* Skills Evaluated */}
        <div
          className="bg-gradient-to-br from-fuchsia-400/40 to-purple-600/40 rounded-2xl border-2 border-fuchsia-300/60 p-6 hover:border-fuchsia-300 hover:from-fuchsia-400/50 hover:to-purple-600/50 transition-all shadow-2xl hover:shadow-fuchsia-500/50 cursor-pointer"
          onClick={() => navigate("/dashboard/reports")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-fuchsia-400/30 rounded-xl flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-400"></div>
            ) : (
              <span className="text-fuchsia-100 text-sm font-semibold">
                View All →
              </span>
            )}
          </div>
          <p className="text-fuchsia-100 text-sm font-semibold mb-1">
            Skills Evaluated
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-lg">
            {stats.skillsEvaluated}
          </p>
        </div>

        {/* GitHub Status */}
        <div
          className={`bg-gradient-to-br ${stats.githubConnected ? "from-green-400/40 to-emerald-600/40 border-green-300/60" : "from-orange-400/40 to-red-600/40 border-orange-300/60"} rounded-2xl border-2 p-6 hover:border-opacity-100 transition-all shadow-2xl cursor-pointer`}
          onClick={() => navigate("/dashboard/integrations")}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-14 h-14 ${stats.githubConnected ? "bg-green-400/30" : "bg-orange-400/30"} rounded-xl flex items-center justify-center`}
            >
              <span className="text-3xl">
                {stats.githubConnected ? "🔗" : "⚠️"}
              </span>
            </div>
            <span
              className={`${stats.githubConnected ? "text-green-100" : "text-orange-100"} text-sm font-semibold`}
            >
              {stats.githubConnected ? "Connected" : "Connect Now →"}
            </span>
          </div>
          <p
            className={`${stats.githubConnected ? "text-green-100" : "text-orange-100"} text-sm font-semibold mb-1`}
          >
            GitHub Integration
          </p>
          <p className="text-white text-2xl font-bold drop-shadow-lg">
            {stats.githubConnected ? "Active" : "Not Connected"}
          </p>
        </div>
      </div>

      {/* Profile Details & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Profile Card */}
        <div className="lg:col-span-2 bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-6 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <span>👤</span> Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-300 text-sm font-semibold">
                  Full Name
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13">
                {profile?.data?.user?.name || "Loading..."}
              </p>
            </div>

            {/* Email */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-400/30 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-emerald-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-300 text-sm font-semibold">
                  Email Address
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 break-all">
                {profile?.data?.user?.email || "Loading..."}
              </p>
            </div>

            {/* Account Status */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-400/30 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-green-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-300 text-sm font-semibold">
                  Account Status
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                Active
              </p>
            </div>

            {/* Member Since */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-400/30 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-300 text-sm font-semibold">
                  Member Since
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13">
                {profile?.data?.user?.createdAt
                  ? new Date(profile.data.user.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", year: "numeric" },
                    )
                  : "Recently"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-6 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/reports")}
              className="w-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/40 hover:to-cyan-500/40 border-2 border-blue-400/50 hover:border-blue-400/70 rounded-xl p-4 transition-all shadow-lg hover:shadow-blue-500/30 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-white font-bold">View Reports</p>
                    <p className="text-blue-200 text-sm">
                      Analyze repositories
                    </p>
                  </div>
                </div>
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/dashboard/integrations")}
              className="w-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/40 hover:to-teal-500/40 border-2 border-emerald-400/50 hover:border-emerald-400/70 rounded-xl p-4 transition-all shadow-lg hover:shadow-emerald-500/30 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <p className="text-white font-bold">Integrations</p>
                    <p className="text-emerald-200 text-sm">Connect services</p>
                  </div>
                </div>
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </button>

            <button
              className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border-2 border-purple-400/50 hover:border-purple-400/70 rounded-xl p-4 transition-all shadow-lg hover:shadow-purple-500/30 text-left group opacity-70 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="text-white font-bold">Settings</p>
                    <p className="text-purple-200 text-sm">Coming soon</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      {!stats.githubConnected && (
        <div className="bg-gradient-to-br from-amber-400/30 to-orange-600/30 rounded-2xl border-2 border-amber-300/60 p-8 shadow-2xl mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-amber-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">🚀</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-2xl font-bold mb-3">
                Get Started with GitAnalyzer
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Connect your GitHub account to start analyzing your
                repositories, tracking your coding skills, and getting insights
                into your development journey!
              </p>
              <button
                onClick={() => navigate("/dashboard/integrations")}
                className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Connect GitHub Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips & Features */}
      <div className="bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-6 shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <span>💡</span> Platform Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-5 border border-white/20 hover:border-blue-400/60 transition-all hover:bg-white/15">
            <div className="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              Repository Analysis
            </h3>
            <p className="text-gray-300 text-sm">
              Deep dive into your repositories with comprehensive code analysis
              and metrics
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 border border-white/20 hover:border-emerald-400/60 transition-all hover:bg-white/15">
            <div className="w-12 h-12 bg-emerald-400/30 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              Skill Tracking
            </h3>
            <p className="text-gray-300 text-sm">
              Automatically identify and track your technical skills based on
              your code
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 border border-white/20 hover:border-purple-400/60 transition-all hover:bg-white/15">
            <div className="w-12 h-12 bg-purple-400/30 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              Visual Insights
            </h3>
            <p className="text-gray-300 text-sm">
              Beautiful charts and graphs to visualize your coding patterns and
              growth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
