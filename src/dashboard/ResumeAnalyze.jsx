import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { analyzeResume } from "../api/userApi";
import useResumeManagement from "../hooks/useResumeManagement";
import ResumeUploadCard from "../components/ResumeUploadCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeViewModal from "../components/ResumeViewModal";
import LoadingScreen from "../components/LoadingScreen";
import RefreshButton from "../components/RefreshButton";
import "./styles/DashboardPages.css";
import { Eye, FolderSync, RefreshCw, Trash } from "lucide-react";

const ResumeAnalyze = () => {
  const {
    resumeData,
    analysisData: initialAnalysisData,
    loading: resumeLoading,
    hasResume,
    handleUpload,
    handleDelete,
    refreshData,
  } = useResumeManagement();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialAnalysisData) {
      setAnalysisData(initialAnalysisData);
    }
  }, [initialAnalysisData]);

  const handleUploadSuccess = (data) => {
    refreshData();
    toast.info("Resume uploaded! Click 'Analyze Resume' to get insights.");
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      // Minimum 1.5 second display for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await analyzeResume();
      if (response.data.success) {
        toast.success("Resume analysis completed!");
        setAnalysisData(response.data.data);
        refreshData();
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to analyze resume. Please try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (resumeLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">AI Resume Analysis</h1>
          <p className="page-subtitle">Unlock insights from your resume</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" text="Loading resume data..." />
        </div>
      </div>
    );
  }

  return (
    <>
      {analyzing && <LoadingScreen message="Analyzing your resume..." />}

      <div className="dashboard-page">
        <RefreshButton onClick={refreshData} />

        <div className="page-header flex justify-between items-end">
          <div>
            <h1 className="page-title">AI Resume Analysis</h1>
            <p className="page-subtitle">
              Upload and analyze your resume with AI-powered insights
            </p>
          </div>
          {analysisData && hasResume && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-4 py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] rounded-lg hover:bg-[#00d9ff]/20 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`}
              />
              {analyzing ? "Re-analyzing..." : "Refresh Analysis"}
            </button>
          )}
        </div>

        {/* Resume Upload Section */}
        {!hasResume && (
          <div className="mb-8">
            <ResumeUploadCard onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Resume Info Card */}
        {hasResume && resumeData && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00f5a0]/20 rounded-lg flex items-center justify-center text-[#00f5a0] text-2xl shadow-[0_0_10px_rgba(0,245,160,0.3)]">
                  ✓
                </div>
                <div>
                  <h4 className="text-white font-semibold">Resume Uploaded</h4>
                  <p className="text-gray-400 text-sm">
                    Uploaded on{" "}
                    {new Date(resumeData.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#00d9ff]/10 text-[#00d9ff] rounded-lg hover:bg-[#00d9ff]/20 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all text-sm font-medium border border-[#00d9ff]/30"
                >
                  <Eye className="w-4 h-4" /> <p>View Resume</p>
                </button>
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#a855f7]/10 text-[#a855f7] rounded-lg hover:bg-[#a855f7]/20 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all text-sm font-medium cursor-pointer border border-[#a855f7]/30 flex items-center gap-2">
                  <FolderSync className=" w-4 h-4" /> <p>Update Resume</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const result = await handleUpload(file);
                        if (result.success) {
                          toast.success("Resume updated successfully!");
                          refreshData();
                          // Clear analysis data so user can re-analyze
                          setAnalysisData(null);
                        }
                      }
                      // Reset input so same file can be selected again
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: "Delete Resume?",
                      text: "This will also delete your analysis results.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#ff006e",
                      cancelButtonColor: "#6c757d",
                      confirmButtonText: "Yes, delete it",
                      cancelButtonText: "Cancel",
                    });

                    if (!result.isConfirmed) return;

                    // Show loading state while deleting
                    Swal.fire({
                      title: "Deleting...",
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    try {
                      const response = await handleDelete();

                      if (response.success) {
                        await Swal.fire({
                          icon: "success",
                          title: "Deleted!",
                          text: "Your resume has been removed successfully.",
                          timer: 1500,
                          showConfirmButton: false,
                        });

                        refreshData();
                      }
                    } catch (error) {
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to delete resume. Please try again.",
                      });
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#ff006e]/10 text-[#ff006e] rounded-lg hover:bg-[#ff006e]/20 hover:shadow-[0_0_10px_rgba(255,0,110,0.2)] transition-all text-sm font-medium border border-[#ff006e]/30"
                >
                  <Trash className="w-4 h-4" />
                  <p>Delete</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {hasResume && !analysisData && (
          <div className="bg-white/10 rounded-2xl p-12 text-center border border-white/20 shadow-xl max-w-2xl mx-auto mt-10">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-pulse">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Analyze
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Our AI will scan your resume to identify strengths, weaknesses,
              and key skills. This process usually takes about 10-15 seconds.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-8 py-4 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] hover:from-[#5a6fd6] hover:via-[#9333ea] hover:to-[#e11d48] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 mx-auto min-w-[200px]"
            >
              {analyzing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🚀</span> Analyze My Resume
                </>
              )}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && (
          <div className="space-y-6">
            {/* ATS Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 bg-gradient-to-br from-[#00d9ff]/20 to-[#a855f7]/40 rounded-2xl p-6 border border-[#00d9ff]/30 shadow-[0_0_20px_rgba(0,217,255,0.2)] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent opacity-50"></div>
                <h3 className="text-[#00d9ff] uppercase tracking-wider text-sm font-bold mb-4 group-hover:text-white transition-colors">
                  ATS Match Score
                </h3>
                <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={
                        analysisData.atsScore >= 80
                          ? "#00f5a0"
                          : analysisData.atsScore >= 60
                            ? "#ff6b35"
                            : "#ff006e"
                      }
                      strokeWidth="3"
                      strokeDasharray={`${analysisData.atsScore}, 100`}
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {analysisData.atsScore}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-300">
                  {analysisData.atsScore >= 80
                    ? "Excellent Profile!"
                    : analysisData.atsScore >= 60
                      ? "Good Foundation"
                      : "Needs Improvement"}
                </p>
              </div>

              {/* Experience Summary */}
              <div className="col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📝</span> Experience Summary
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {analysisData.experienceSummary || "No summary available."}
                </p>
                {analysisData.analyzedAt && (
                  <p className="text-gray-500 text-xs mt-4">
                    Last analyzed:{" "}
                    {new Date(analysisData.analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg hover:border-[#00f5a0]/30 transition-all">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-[#00f5a0] drop-shadow-[0_0_5px_rgba(0,245,160,0.5)]">
                  <span>💪</span> Key Strengths
                </h3>
                <ul className="space-y-2">
                  {analysisData.strengths &&
                  analysisData.strengths.length > 0 ? (
                    analysisData.strengths.map((str, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className="text-[#00f5a0] mt-1">✓</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No strengths identified yet.
                    </p>
                  )}
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg hover:border-[#ff006e]/30 transition-all">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-[#ff006e] drop-shadow-[0_0_5px_rgba(255,0,110,0.5)]">
                  <span>⚠️</span> Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {analysisData.weaknesses &&
                  analysisData.weaknesses.length > 0 ? (
                    analysisData.weaknesses.map((weak, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className="text-[#ff006e] mt-1">!</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No weaknesses identified.
                    </p>
                  )}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg hover:border-[#ff6b35]/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-[#ff6b35] drop-shadow-[0_0_5px_rgba(255,107,53,0.5)]">
                <span>💡</span> Actionable Suggestions
              </h3>
              <ul className="space-y-3">
                {analysisData.suggestions &&
                analysisData.suggestions.length > 0 ? (
                  analysisData.suggestions.map((sug, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-[#ff6b35]/20 hover:border-[#ff6b35]/40 transition-all"
                    >
                      <span className="text-[#ff6b35] mt-1 font-bold">
                        {index + 1}.
                      </span>
                      <span className="text-gray-300">{sug}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No suggestions available.
                  </p>
                )}
              </ul>
            </div>

            {/* Technical Skills */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg hover:border-[#00d9ff]/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🛠️</span> Identified Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.skills && analysisData.skills.length > 0 ? (
                  analysisData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 rounded-full text-sm font-medium hover:bg-[#00d9ff]/20 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No specific skills identified.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resume View Modal */}
        <ResumeViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resumeData={resumeData}
        />
      </div>
    </>
  );
};

export default ResumeAnalyze;
