import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/DashboardPages.css";
import "./styles/BrightColors.css";
import {
  ArrowLeft,
  RefreshCw,
  Hand,
  FileText,
  Mic,
  ClipboardList,
  Link,
  AlertTriangle,
  User,
  Mail,
  Target,
  Star,
} from "lucide-react";
import "../components/RefreshButton.css"
const Overview = ({ profile, handleRefresh }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    atsScore: 0,
    interviewCount: 0,
    quizCount: 0,
    githubConnected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && profile.data) {
      const { resumeAnalysis, stats: userStats, connections } = profile.data;
      setStats({
        atsScore: resumeAnalysis?.atsScore || 0,
        interviewCount: userStats?.interviewCount || 0,
        quizCount: userStats?.quizCount || 0,
        githubConnected: connections?.githubConnected || false,
      });
      setLoading(false);
    }
  }, [profile]);

  const onRefresh = () => {
    setLoading(true);
    handleRefresh();
    // Profile update will trigger useEffect
  };

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <div className="page-header mb-8 flex flex-wrap items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
            {" "}
            <ArrowLeft className="w-5 h-5" />{" "}
            <a href="/" className="p-0.5">
              Back to home
            </a>
          </h1>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Hand className="w-10 h-10" /> Welcome back,{" "}
            {profile?.data?.user?.name?.split(" ")[0] || "User"} !
          </h1>
          <p className="text-gray-300 text-lg">
            Here's an overview of your career preparation journey
          </p>
        </div>
        <div>
          <button
            onClick={onRefresh}
            className="refresh-button"
          >
            Refresh <RefreshCw className="inline-block ml-1 " />
          </button>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Resume ATS Score */}
        {/* Resume ATS Score - Cyan/Blue Theme */}
        <div
          className="bg-gradient-to-br from-[#00d9ff]/20 to-[#667eea]/20 rounded-2xl border-2 border-[#00d9ff]/50 p-6 hover:border-[#00d9ff] hover:from-[#00d9ff]/30 hover:to-[#667eea]/30 transition-all shadow-lg hover:shadow-[#00d9ff]/40 cursor-pointer group"
          onClick={() => navigate("/dashboard/resume-analyse")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-[#00d9ff]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-[#00d9ff]" />
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00d9ff]"></div>
            ) : (
              <span className="text-[#00d9ff] text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                Analyze →
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm font-semibold mb-1">
            Resume ATS Score
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">
            {stats.atsScore}%
          </p>
        </div>

        {/* Interviews Completed */}
        {/* Interviews Completed - Purple/Pink Theme */}
        <div
          className="bg-gradient-to-br from-[#a855f7]/20 to-[#ff006e]/20 rounded-2xl border-2 border-[#a855f7]/50 p-6 hover:border-[#a855f7] hover:from-[#a855f7]/30 hover:to-[#ff006e]/30 transition-all shadow-lg hover:shadow-[#a855f7]/40 cursor-pointer group"
          onClick={() => navigate("/dashboard/interview")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-[#a855f7]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Mic className="w-8 h-8 text-[#a855f7]" />
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#a855f7]"></div>
            ) : (
              <span className="text-[#a855f7] text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                Practice →
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm font-semibold mb-1">
            Interviews Completed
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {stats.interviewCount}
          </p>
        </div>

        {/* Quizzes Taken */}
        {/* Quizzes Taken - Green/Cyan Theme */}
        <div
          className="bg-gradient-to-br from-[#00f5a0]/20 to-[#00d9ff]/20 rounded-2xl border-2 border-[#00f5a0]/50 p-6 hover:border-[#00f5a0] hover:from-[#00f5a0]/30 hover:to-[#00d9ff]/30 transition-all shadow-lg hover:shadow-[#00f5a0]/40 cursor-pointer group"
          onClick={() => navigate("/dashboard/quiz")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-[#00f5a0]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ClipboardList className="w-8 h-8 text-[#00f5a0]" />
            </div>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00f5a0]"></div>
            ) : (
              <span className="text-[#00f5a0] text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                Take Quiz →
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm font-semibold mb-1">
            Quizzes Taken
          </p>
          <p className="text-white text-4xl font-bold drop-shadow-[0_0_10px_rgba(0,245,160,0.5)]">
            {stats.quizCount}
          </p>
        </div>

        {/* GitHub Status */}
        {/* GitHub Status - Dynamic Theme */}
        <div
          className={`bg-gradient-to-br ${
            stats.githubConnected
              ? "from-[#00f5a0]/20 to-[#00d9ff]/20 border-[#00f5a0]/50 hover:border-[#00f5a0] hover:shadow-[#00f5a0]/40"
              : "from-[#ff6b35]/20 to-[#ff006e]/20 border-[#ff6b35]/50 hover:border-[#ff6b35] hover:shadow-[#ff6b35]/40"
          } rounded-2xl border-2 p-6 transition-all shadow-lg cursor-pointer group`}
          onClick={() => navigate("/dashboard/integrations")}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-14 h-14 ${
                stats.githubConnected ? "bg-[#00f5a0]/20" : "bg-[#ff6b35]/20"
              } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <span className="text-3xl">
                {stats.githubConnected ? (
                  <Link className="w-8 h-8 text-[#00f5a0]" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-[#ff6b35]" />
                )}
              </span>
            </div>
            <span
              className={`${
                stats.githubConnected ? "text-[#00f5a0]" : "text-[#ff6b35]"
              } text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              {stats.githubConnected ? "Connected" : "Connect Now →"}
            </span>
          </div>
          <p className="text-gray-300 text-sm font-semibold mb-1">
            GitHub Integration
          </p>
          <p
            className={`text-white text-2xl font-bold drop-shadow-[0_0_10px_${stats.githubConnected ? "rgba(0,245,160,0.5)" : "rgba(255,107,53,0.5)"}]`}
          >
            {stats.githubConnected ? "Active" : "Not Connected"}
          </p>
        </div>
      </div>

      {/* Profile Details & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Profile Card */}
        <div className="lg:col-span-2 bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-6 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6" /> Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#00d9ff]/50 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#00d9ff]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-[#00d9ff]" />
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">
                  Full Name
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 group-hover:text-[#00d9ff] transition-colors">
                {profile?.data?.user?.name || "Loading..."}
              </p>
            </div>

            {/* Email */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#a855f7]/50 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#a855f7]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-[#a855f7]" />
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">
                  Email Address
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 break-all group-hover:text-[#a855f7] transition-colors">
                {profile?.data?.user?.email || "Loading..."}
              </p>
            </div>

            {/* Target Role */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#ff006e]/50 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff006e]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-[#ff006e]" />
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">
                  Target Role
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 group-hover:text-[#ff006e] transition-colors">
                {profile?.data?.profile?.targetRole || "Not set"}
              </p>
            </div>

            {/* Experience Level */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#ffd700]/50 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ffd700]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-[#ffd700]" />
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">
                  Experience Level
                </h3>
              </div>
              <p className="text-white text-lg font-bold pl-13 capitalize group-hover:text-[#ffd700] transition-colors">
                {profile?.data?.profile?.experienceLevel || "Not set"}
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
              onClick={() => navigate("/dashboard/resume-analyse")}
              className="w-full bg-gradient-to-r from-[#00d9ff]/10 to-[#667eea]/10 hover:from-[#00d9ff]/20 hover:to-[#667eea]/20 border-2 border-[#00d9ff]/30 hover:border-[#00d9ff]/60 rounded-xl p-4 transition-all shadow-lg hover:shadow-[#00d9ff]/20 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-7 h-7 text-[#00d9ff]" />
                  <div>
                    <p className="text-white font-bold group-hover:text-[#00d9ff] transition-colors">
                      Resume Analysis
                    </p>
                    <p className="text-gray-400 text-sm">Check ATS score</p>
                  </div>
                </div>
                <span className="text-[#00d9ff] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/dashboard/interview")}
              className="w-full bg-gradient-to-r from-[#a855f7]/10 to-[#ff006e]/10 hover:from-[#a855f7]/20 hover:to-[#ff006e]/20 border-2 border-[#a855f7]/30 hover:border-[#a855f7]/60 rounded-xl p-4 transition-all shadow-lg hover:shadow-[#a855f7]/20 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-7 h-7 text-[#a855f7]" />
                  <div>
                    <p className="text-white font-bold group-hover:text-[#a855f7] transition-colors">
                      Mock Interview
                    </p>
                    <p className="text-gray-400 text-sm">Practice questions</p>
                  </div>
                </div>
                <span className="text-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/dashboard/quiz")}
              className="w-full bg-gradient-to-r from-[#00f5a0]/10 to-[#00d9ff]/10 hover:from-[#00f5a0]/20 hover:to-[#00d9ff]/20 border-2 border-[#00f5a0]/30 hover:border-[#00f5a0]/60 rounded-xl p-4 transition-all shadow-lg hover:shadow-[#00f5a0]/20 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(0,245,160,0.5)]">
                    📝
                  </span>
                  <div>
                    <p className="text-white font-bold group-hover:text-[#00f5a0] transition-colors">
                      Skill Quiz
                    </p>
                    <p className="text-gray-400 text-sm">Test your knowledge</p>
                  </div>
                </div>
                <span className="text-[#00f5a0] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  →
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tips & Features */}
      <div className="bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-6 shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <span>💡</span> Platform Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#00d9ff]/50 transition-all hover:bg-white/10 group">
            <div className="w-12 h-12 bg-[#00d9ff]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(0,217,255,0.5)]">
                📄
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00d9ff] transition-colors">
              Resume Analysis
            </h3>
            <p className="text-gray-400 text-sm">
              Get detailed insights on your resume and optimize it for ATS.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#00f5a0]/50 transition-all hover:bg-white/10 group">
            <div className="w-12 h-12 bg-[#00f5a0]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(0,245,160,0.5)]">
                📝
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00f5a0] transition-colors">
              Skill Quizzes
            </h3>
            <p className="text-gray-400 text-sm">
              Take quizzes generated based on your skills to validate your
              knowledge.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#a855f7]/50 transition-all hover:bg-white/10 group">
            <div className="w-12 h-12 bg-[#a855f7]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                🎤
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#a855f7] transition-colors">
              Mock Interviews
            </h3>
            <p className="text-gray-400 text-sm">
              Practice answering technical questions tailored to your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
