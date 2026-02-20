import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  startInterview,
  submitInterviewAnswer,
  completeInterview,
  getInterviewHistory,
  deleteInterview,
} from "../api/userApi";
import LoadingScreen from "../components/LoadingScreen";
import RefreshButton from "../components/RefreshButton";
import "./styles/DashboardPages.css";
import { Mic, MicOff, Square, Play, Rocket, PartyPopper } from "lucide-react";

const Interview = () => {
  const [loading, setLoading] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [view, setView] = useState("start"); // start, interview, result, history
  // console.log("Complete Interview session data :  ",session);
  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  // console.log("History data : ", history);
  useEffect(() => {
    loadHistory();
    return () => {
      // Cleanup recognition on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswer((prev) => prev + " " + finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      let errorMessage = "Error with voice input";
      if (event.error === "not-allowed") {
        errorMessage = "Microphone access denied. Please allow permission.";
      } else if (event.error === "no-speech") {
        errorMessage = "No speech detected. Please try again.";
      } else if (event.error === "network") {
        errorMessage = "Network error. Check your connection.";
      } else {
        errorMessage = `Voice input error: ${event.error}`;
      }
      toast.error(errorMessage);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getInterviewHistory();
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setStartingInterview(true);
      // console.log("🚀 Starting new interview session...");
      // Minimum 1.5 second display for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await startInterview({});
      // console.log("📦 Interview start response:", response);
      // console.log("📋 Questions received:", response.data.data.questions);
      // console.log("🆔 Session ID:", response.data.data.sessionId);

      if (response.data.success) {
        setSession(response.data.data);
        setView("interview");
        setCurrentQuestionIndex(0);
        setAnswer("");
        setFeedback(null);
        // console.log("✅ Interview session started successfully!");
      }
    } catch (error) {
      // console.error("❌ Error starting interview:", error);
      toast.error(error.response?.data?.message || "Failed to start interview");
    } finally {
      setStartingInterview(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.warning("Please enter an answer");
      return;
    }

    try {
      setSubmitting(true);
      stopListening(); // Stop listening on submit
      console.log("📤 Submitting answer for question", currentQuestionIndex);
      console.log("💬 Answer:", answer);

      const response = await submitInterviewAnswer(session.sessionId, {
        questionIndex: currentQuestionIndex,
        answer: answer,
      });

      console.log("📦 Submit answer response:", response);
      console.log("📊 Feedback data:", response.data.data);
      console.log("⭐ Score:", response.data.data?.score);
      console.log("💭 Feedback:", response.data.data?.feedback);

      if (response.data.success) {
        setFeedback(response.data.data);
        console.log("✅ Answer submitted and feedback received!");
      }
    } catch (error) {
      // console.error("❌ Error submitting answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < session.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setAnswer("");
      setFeedback(null);
    } else {
      await finishInterview();
    }
  };

  const finishInterview = async () => {
    try {
      setLoading(true);
      stopListening();
      const response = await completeInterview(session.sessionId);
      if (response.data.success) {
        setSession(response.data.data); // Update session with final results
        setView("result");
        loadHistory(); // Refresh history
      }
    } catch (error) {
      // console.error("Error completing interview:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete interview",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (sessionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteInterview(sessionId);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Interview session deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        loadHistory();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to delete interview session",
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {startingInterview && (
        <LoadingScreen message="Preparing your interview questions..." />
      )}

      <div className="dashboard-page">
        <RefreshButton onClick={loadHistory} />

        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title">Mock Interview</h1>
            <p className="page-subtitle">
              Practice technical questions tailored to your profile
            </p>
          </div>

          {view !== "interview" && (
            <button
              onClick={() => setView(view === "history" ? "start" : "history")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00d9ff] border border-[#00d9ff]/30 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all"
            >
              {view === "history" ? "Start New Interview" : "View History"}
            </button>
          )}
        </div>

        {view === "start" && (
          <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-2xl p-10 border border-[#a855f7]/30 text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>
              <div className="w-24 h-24 bg-[#a855f7]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse">
                🎤
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                Ready for your interview?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Our AI will ask you technical questions based on your resume and
                skills. You'll receive instant feedback on your answers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all group">
                  <div className="text-[#00d9ff] font-bold text-lg mb-1 group-hover:text-white transition-colors">
                    1. AI Generated
                  </div>
                  <p className="text-gray-400 text-sm">
                    Questions tailored specifically to your tech stack and
                    experience level.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-[#a855f7]/20 hover:border-[#a855f7]/50 transition-all group">
                  <div className="text-[#a855f7] font-bold text-lg mb-1 group-hover:text-white transition-colors">
                    2. Instant Feedback
                  </div>
                  <p className="text-gray-400 text-sm">
                    Get real-time analysis of your answers with scoring and
                    suggestions.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-[#ff006e]/20 hover:border-[#ff006e]/50 transition-all group">
                  <div className="text-[#ff006e] font-bold text-lg mb-1 group-hover:text-white transition-colors">
                    3. Track Progress
                  </div>
                  <p className="text-gray-400 text-sm">
                    Monitor your improvement over time with detailed history and
                    analytics.
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                className="px-8 py-4 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] hover:from-[#5a6fd6] hover:via-[#9333ea] hover:to-[#e11d48] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-lg flex items-center justify-center gap-3 mx-auto"
              >
                <span>🚀</span> Start Interview Session
              </button>
            </div>
          </div>
        )}

        {view === "interview" && session && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-400">
                Question {currentQuestionIndex + 1} of{" "}
                {session.questions.length}
              </div>
              <div className="w-1/3 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#00f5a0] h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 mb-6">
              <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
                {session.questions[currentQuestionIndex]}
              </h3>

              {!feedback ? (
                <>
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here or click the microphone to speak..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] mb-4"
                    ></textarea>

                    {/* Voice Button */}
                    <button
                      onClick={toggleListening}
                      className={`absolute bottom-6 right-6 p-3 rounded-full transition-all shadow-lg ${
                        isListening
                          ? "bg-[#ff006e] hover:bg-[#e60063] animate-pulse shadow-[0_0_20px_rgba(255,0,110,0.5)]"
                          : "bg-[#a855f7] hover:bg-[#9333ea] shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      }`}
                      title={isListening ? "Stop Recording" : "Start Recording"}
                    >
                      {isListening ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                          />
                        </svg>
                      )}
                    </button>
                    {isListening && (
                      <span className="absolute bottom-6 right-20 text-red-400 text-sm font-medium animate-pulse">
                        Listening...
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting || !answer.trim()}
                      className="px-6 py-3 bg-[#00d9ff]/20 hover:bg-[#00d9ff]/30 text-[#00d9ff] font-bold rounded-lg border border-[#00d9ff]/30 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <div className="spinner w-4 h-4 border-white"></div>
                      ) : (
                        "Submit Answer"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-fade-in">
                  <div className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10">
                    <h4 className="text-gray-400 text-sm mb-2">
                      You Answered:
                    </h4>
                    <p className="text-gray-300 italic">{answer}</p>
                  </div>

                  <div
                    className={`rounded-xl p-6 mb-6 border ${feedback.score >= 7 ? "bg-[#00f5a0]/10 border-[#00f5a0]/30" : feedback.score >= 4 ? "bg-[#ffd700]/10 border-[#ffd700]/30" : "bg-[#ff006e]/10 border-[#ff006e]/30"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-white">Feedback</h4>
                      <div
                        className={`px-3 py-1 rounded-full font-bold text-sm ${feedback.score >= 7 ? "bg-[#00f5a0]/20 text-[#00f5a0]" : feedback.score >= 4 ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-[#ff006e]/20 text-[#ff006e]"}`}
                      >
                        Score: {feedback.score}/10
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {feedback.feedback}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      {currentQuestionIndex < session.questions.length - 1
                        ? "Next Question →"
                        : "Finish Interview 🎉"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "result" && session && (
          <div className="max-w-2xl mx-auto mt-10 text-center">
            <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-3xl p-10 border border-[#a855f7]/30 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <div className="w-24 h-24 bg-[#00f5a0]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce shadow-[0_0_20px_rgba(0,245,160,0.4)]">
                🏆
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Interview Completed!
              </h2>
              <p className="text-gray-400 mb-8">
                Great job on completing the session.
              </p>

              <div className="flex justify-center gap-8 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {session.performanceMetrics.averageScore}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Avg Score
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {session.performanceMetrics.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Questions
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.floor(session.performanceMetrics.averageScore / 2)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Rating
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setView("history")}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                  View History
                </button>
                <button
                  onClick={handleStartInterview}
                  className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#a855f7] hover:from-[#5a6fd6] hover:to-[#9333ea] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Start New Session
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "history" && (
          <div className="mt-8">
            {history.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg mb-4">
                  No interview history found.
                </p>
                <button
                  onClick={() => setView("start")}
                  className="text-[#a855f7] hover:text-[#9333ea] underline"
                >
                  Start your first interview
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-gray-400 text-sm">
                        {new Date(item.startedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold ${item.status === "completed" ? "bg-[#00f5a0]/20 text-[#00f5a0]" : "bg-[#ffd700]/20 text-[#ffd700]"}`}
                        >
                          {item.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </div>
                        <button
                          onClick={() => handleDeleteInterview(item._id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete interview session"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white mb-1">
                        {item?.performanceMetrics?.averageScore != null
                          ? Math.round(
                              item.performanceMetrics.averageScore / 10,
                            )
                          : "-"}
                        <span className="text-lg text-gray-500">/10</span>
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        Average Score
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">Questions</span>
                        <span className="text-white font-semibold">
                          {item?.performanceMetrics?.totalQuestions ?? "-"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 block">Duration</span>
                        <span className="text-white font-semibold">
                          {item.completedAt
                            ? Math.round(
                                (new Date(item.completedAt) -
                                  new Date(item.startedAt)) /
                                  60000,
                              ) + " min"
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Interview;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { toast } from "react-toastify";
// import {
//   startInterview,
//   submitInterviewAnswer,
//   completeInterview,
//   getInterviewHistory,
//   deleteInterview,
// } from "../api/userApi";
// import LoadingScreen from "../components/LoadingScreen";
// import RefreshButton from "../components/RefreshButton";
// import "./styles/DashboardPages.css";
// import { Mic, MicOff, Square, Play, Rocket, PartyPopper } from "lucide-react";

// const Interview = () => {
//   const [loading, setLoading] = useState(false);
//   const [startingInterview, setStartingInterview] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [session, setSession] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [view, setView] = useState("start"); // start, interview, result, history
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [tabWarning, setTabWarning] = useState(false);

//   // Voice Recognition State
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);
//   const fullscreenRef = useRef(null);
//   const textareaRef = useRef(null);
//   const sessionRef = useRef(null);
//   const currentQuestionIndexRef = useRef(0);
//   const answerRef = useRef("");
//   const submittingRef = useRef(false);
//   const feedbackRef = useRef(null);

//   // Keep refs in sync with state
//   useEffect(() => { sessionRef.current = session; }, [session]);
//   useEffect(() => { currentQuestionIndexRef.current = currentQuestionIndex; }, [currentQuestionIndex]);
//   useEffect(() => { answerRef.current = answer; }, [answer]);
//   useEffect(() => { submittingRef.current = submitting; }, [submitting]);
//   useEffect(() => { feedbackRef.current = feedback; }, [feedback]);

//   // ── Fullscreen helpers ──────────────────────────────────────────────
//   const enterFullscreen = () => {
//     const el = fullscreenRef.current || document.documentElement;
//     if (el.requestFullscreen) el.requestFullscreen();
//     else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
//     else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
//   };

//   const exitFullscreen = () => {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       const isFull = !!(
//         document.fullscreenElement ||
//         document.webkitFullscreenElement ||
//         document.mozFullScreenElement
//       );
//       setIsFullscreen(isFull);
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
//       document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
//     };
//   }, []);

//   // ── Tab switch / visibility change → auto-submit ────────────────────
//   const autoSubmitDueToTabSwitch = useCallback(async () => {
//     const currentSession = sessionRef.current;
//     const currentAnswer = answerRef.current;
//     const isSubmitting = submittingRef.current;
//     const currentFeedback = feedbackRef.current;
//     const qIndex = currentQuestionIndexRef.current;

//     // Only auto-submit if in interview view and not already submitted
//     if (!currentSession || currentFeedback || isSubmitting) return;

//     const answerToSubmit = currentAnswer.trim() || "[No answer provided — tab switched]";

//     setTabWarning(true);
//     toast.warning("⚠️ Tab switch detected! Answer auto-submitted.", { autoClose: 4000 });

//     try {
//       setSubmitting(true);
//       stopListening();
//       const response = await submitInterviewAnswer(currentSession.sessionId, {
//         questionIndex: qIndex,
//         answer: answerToSubmit,
//       });
//       if (response.data.success) {
//         setFeedback(response.data.data);
//       }
//     } catch (error) {
//       console.error("Auto-submit error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && view === "interview") {
//         autoSubmitDueToTabSwitch();
//       }
//     };
//     const handleBlur = () => {
//       if (view === "interview") {
//         autoSubmitDueToTabSwitch();
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("blur", handleBlur);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("blur", handleBlur);
//     };
//   }, [view, autoSubmitDueToTabSwitch]);

//   // ── Enter key → submit answer ───────────────────────────────────────
//   const handleKeyDown = (e) => {
//     // Shift+Enter = new line, Enter alone = submit
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (!feedback && answer.trim() && !submitting) {
//         handleSubmitAnswer();
//       }
//     }
//   };

//   // ── No copy-paste in textarea ───────────────────────────────────────
//   const blockCopyPaste = (e) => {
//     e.preventDefault();
//     toast.info("Copy/paste is disabled during the interview.", { autoClose: 2000, toastId: "no-paste" });
//   };

//   useEffect(() => {
//     loadHistory();
//     return () => {
//       if (recognitionRef.current) recognitionRef.current.stop();
//       if (isFullscreen) exitFullscreen();
//     };
//   }, []);

//   // ── Voice Recognition ───────────────────────────────────────────────
//   const startListening = () => {
//     if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
//       toast.error("Browser does not support speech recognition.");
//       return;
//     }
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = true;
//     recognitionRef.current.interimResults = true;
//     recognitionRef.current.lang = "en-US";
//     recognitionRef.current.onstart = () => setIsListening(true);
//     recognitionRef.current.onresult = (event) => {
//       let finalTranscript = "";
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
//       }
//       if (finalTranscript) setAnswer((prev) => prev + " " + finalTranscript);
//     };
//     recognitionRef.current.onerror = (event) => {
//       setIsListening(false);
//       let msg = "Voice input error";
//       if (event.error === "not-allowed") msg = "Microphone access denied.";
//       else if (event.error === "no-speech") msg = "No speech detected.";
//       else if (event.error === "network") msg = "Network error.";
//       toast.error(msg);
//     };
//     recognitionRef.current.onend = () => setIsListening(false);
//     recognitionRef.current.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const toggleListening = () => (isListening ? stopListening() : startListening());

//   // ── API Calls ───────────────────────────────────────────────────────
//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await getInterviewHistory();
//       if (response.data.success) setHistory(response.data.data);
//     } catch (error) {
//       console.error("Error loading history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartInterview = async () => {
//     try {
//       setStartingInterview(true);
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const response = await startInterview({});
//       if (response.data.success) {
//         setSession(response.data.data);
//         setView("interview");
//         setCurrentQuestionIndex(0);
//         setAnswer("");
//         setFeedback(null);
//         setTabWarning(false);
//         // Enter fullscreen
//         setTimeout(() => enterFullscreen(), 100);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to start interview");
//     } finally {
//       setStartingInterview(false);
//     }
//   };

//   const handleSubmitAnswer = async () => {
//     if (!answer.trim()) {
//       toast.warning("Please enter an answer");
//       return;
//     }
//     try {
//       setSubmitting(true);
//       stopListening();
//       const response = await submitInterviewAnswer(session.sessionId, {
//         questionIndex: currentQuestionIndex,
//         answer: answer,
//       });
//       if (response.data.success) setFeedback(response.data.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit answer");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     const nextIndex = currentQuestionIndex + 1;
//     if (nextIndex < session.questions.length) {
//       setCurrentQuestionIndex(nextIndex);
//       setAnswer("");
//       setFeedback(null);
//       setTabWarning(false);
//     } else {
//       await finishInterview();
//     }
//   };

//   const finishInterview = async () => {
//     try {
//       setLoading(true);
//       stopListening();
//       exitFullscreen();
//       const response = await completeInterview(session.sessionId);
//       if (response.data.success) {
//         setSession(response.data.data);
//         setView("result");
//         loadHistory();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to complete interview");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteInterview = async (sessionId) => {
//     if (!window.confirm("Are you sure you want to delete this interview session? This action cannot be undone.")) return;
//     try {
//       const response = await deleteInterview(sessionId);
//       if (response.data.success) {
//         toast.success("Interview session deleted successfully");
//         loadHistory();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete interview session");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-page flex items-center justify-center h-screen">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {startingInterview && <LoadingScreen message="Preparing your interview questions..." />}

//       <div className="dashboard-page" ref={fullscreenRef}>
//         <RefreshButton onClick={loadHistory} />

//         <div className="page-header flex justify-between items-center">
//           <div>
//             <h1 className="page-title">Mock Interview</h1>
//             <p className="page-subtitle">Practice technical questions tailored to your profile</p>
//           </div>
//           {view !== "interview" && (
//             <button
//               onClick={() => setView(view === "history" ? "start" : "history")}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00d9ff] border border-[#00d9ff]/30 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all"
//             >
//               {view === "history" ? "Start New Interview" : "View History"}
//             </button>
//           )}
//         </div>

//         {view === "start" && (
//           <div className="max-w-3xl mx-auto mt-10">
//             <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-2xl p-10 border border-[#a855f7]/30 text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden">
//               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>
//               <div className="w-24 h-24 bg-[#a855f7]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse">
//                 🎤
//               </div>
//               <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
//                 Ready for your interview?
//               </h2>
//               <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
//                 Our AI will ask you technical questions based on your resume and skills. You'll receive instant feedback on your answers.
//               </p>

//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-left">
//                 <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
//                   <span>⚠️</span> Interview Rules
//                 </h3>
//                 <ul className="text-yellow-200/80 text-sm space-y-1">
//                   <li>• The interview runs in <strong>fullscreen</strong> mode — do not exit.</li>
//                   <li>• <strong>Copy & paste</strong> are disabled during the interview.</li>
//                   <li>• Switching tabs or losing focus will <strong>auto-submit</strong> your current answer.</li>
//                   <li>• Press <strong>Enter</strong> to submit an answer (Shift+Enter for new line).</li>
//                 </ul>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all group">
//                   <div className="text-[#00d9ff] font-bold text-lg mb-1 group-hover:text-white transition-colors">1. AI Generated</div>
//                   <p className="text-gray-400 text-sm">Questions tailored specifically to your tech stack and experience level.</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#a855f7]/20 hover:border-[#a855f7]/50 transition-all group">
//                   <div className="text-[#a855f7] font-bold text-lg mb-1 group-hover:text-white transition-colors">2. Instant Feedback</div>
//                   <p className="text-gray-400 text-sm">Get real-time analysis of your answers with scoring and suggestions.</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#ff006e]/20 hover:border-[#ff006e]/50 transition-all group">
//                   <div className="text-[#ff006e] font-bold text-lg mb-1 group-hover:text-white transition-colors">3. Track Progress</div>
//                   <p className="text-gray-400 text-sm">Monitor your improvement over time with detailed history and analytics.</p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleStartInterview}
//                 className="px-8 py-4 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] hover:from-[#5a6fd6] hover:via-[#9333ea] hover:to-[#e11d48] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-lg flex items-center justify-center gap-3 mx-auto"
//               >
//                 <span>🚀</span> Start Interview Session
//               </button>
//             </div>
//           </div>
//         )}

//         {view === "interview" && session && (
//           <div className="max-w-4xl mx-auto mt-6">
//             {/* Auto re-enter fullscreen silently if user exits */}
//             {!isFullscreen && view === "interview" && (() => { enterFullscreen(); return null; })()}

//             {tabWarning && (
//               <div className="mb-4 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm flex items-center gap-2">
//                 <span>🚨</span>
//                 <span>Tab switch detected — your answer was auto-submitted. Please stay focused on this tab.</span>
//               </div>
//             )}

//             <div className="flex justify-between items-center mb-6">
//               <div className="text-gray-400">
//                 Question {currentQuestionIndex + 1} of {session.questions.length}
//               </div>
//               <div className="w-1/3 bg-gray-700 rounded-full h-2">
//                 <div
//                   className="bg-[#00f5a0] h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]"
//                   style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             <div className="bg-white/10 rounded-2xl p-8 border border-white/20 mb-6">
//               <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
//                 {session.questions[currentQuestionIndex]}
//               </h3>

//               {!feedback ? (
//                 <>
//                   <div className="relative">
//                     <textarea
//                       ref={textareaRef}
//                       value={answer}
//                       onChange={(e) => setAnswer(e.target.value)}
//                       onKeyDown={handleKeyDown}
//                       onCopy={blockCopyPaste}
//                       onPaste={blockCopyPaste}
//                       onCut={blockCopyPaste}
//                       onContextMenu={(e) => e.preventDefault()}
//                       placeholder="Type your answer here and press Enter to submit (Shift+Enter for new line), or click the microphone to speak..."
//                       className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] mb-4 select-none"
//                       style={{ userSelect: "none" }}
//                     ></textarea>

//                     <div className="absolute bottom-6 left-4 text-gray-600 text-xs pointer-events-none">
//                       Enter to submit · Shift+Enter for new line
//                     </div>

//                     <button
//                       onClick={toggleListening}
//                       className={`absolute bottom-6 right-6 p-3 rounded-full transition-all shadow-lg ${
//                         isListening
//                           ? "bg-[#ff006e] hover:bg-[#e60063] animate-pulse shadow-[0_0_20px_rgba(255,0,110,0.5)]"
//                           : "bg-[#a855f7] hover:bg-[#9333ea] shadow-[0_0_15px_rgba(168,85,247,0.3)]"
//                       }`}
//                       title={isListening ? "Stop Recording" : "Start Recording"}
//                     >
//                       {isListening ? (
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
//                         </svg>
//                       ) : (
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
//                         </svg>
//                       )}
//                     </button>
//                     {isListening && (
//                       <span className="absolute bottom-6 right-20 text-red-400 text-sm font-medium animate-pulse">
//                         Listening...
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleSubmitAnswer}
//                       disabled={submitting || !answer.trim()}
//                       className="px-6 py-3 bg-[#00d9ff]/20 hover:bg-[#00d9ff]/30 text-[#00d9ff] font-bold rounded-lg border border-[#00d9ff]/30 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {submitting ? (
//                         <div className="spinner w-4 h-4 border-white"></div>
//                       ) : (
//                         <>Submit Answer <kbd className="ml-1 px-1.5 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded text-xs">↵</kbd></>
//                       )}
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="animate-fade-in">
//                   <div className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10">
//                     <h4 className="text-gray-400 text-sm mb-2">You Answered:</h4>
//                     <p className="text-gray-300 italic">{answer}</p>
//                   </div>

//                   <div className={`rounded-xl p-6 mb-6 border ${feedback.score >= 7 ? "bg-[#00f5a0]/10 border-[#00f5a0]/30" : feedback.score >= 4 ? "bg-[#ffd700]/10 border-[#ffd700]/30" : "bg-[#ff006e]/10 border-[#ff006e]/30"}`}>
//                     <div className="flex justify-between items-start mb-4">
//                       <h4 className="font-bold text-lg text-white">Feedback</h4>
//                       <div className={`px-3 py-1 rounded-full font-bold text-sm ${feedback.score >= 7 ? "bg-[#00f5a0]/20 text-[#00f5a0]" : feedback.score >= 4 ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-[#ff006e]/20 text-[#ff006e]"}`}>
//                         Score: {feedback.score}/10
//                       </div>
//                     </div>
//                     <p className="text-gray-200 leading-relaxed">{feedback.feedback}</p>
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleNextQuestion}
//                       className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
//                     >
//                       {currentQuestionIndex < session.questions.length - 1 ? "Next Question →" : "Finish Interview 🎉"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {view === "result" && session && (
//           <div className="max-w-2xl mx-auto mt-10 text-center">
//             <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-3xl p-10 border border-[#a855f7]/30 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)]">
//               <div className="w-24 h-24 bg-[#00f5a0]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce shadow-[0_0_20px_rgba(0,245,160,0.4)]">
//                 🏆
//               </div>
//               <h2 className="text-3xl font-bold text-white mb-2">Interview Completed!</h2>
//               <p className="text-gray-400 mb-8">Great job on completing the session.</p>

//               <div className="flex justify-center gap-8 mb-10">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{session.averageScore}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Avg Score</div>
//                 </div>
//                 <div className="w-px bg-white/10"></div>
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{session.totalQuestions}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Questions</div>
//                 </div>
//                 <div className="w-px bg-white/10"></div>
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{Math.floor(session.averageScore / 2)}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Rating</div>
//                 </div>
//               </div>

//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={() => setView("history")}
//                   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
//                 >
//                   View History
//                 </button>
//                 <button
//                   onClick={handleStartInterview}
//                   className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#a855f7] hover:from-[#5a6fd6] hover:to-[#9333ea] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
//                 >
//                   Start New Session
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {view === "history" && (
//           <div className="mt-8">
//             {history.length === 0 ? (
//               <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
//                 <p className="text-gray-400 text-lg mb-4">No interview history found.</p>
//                 <button onClick={() => setView("start")} className="text-[#a855f7] hover:text-[#9333ea] underline">
//                   Start your first interview
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {history.map((item) => (
//                   <div key={item._id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-colors group">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="text-gray-400 text-sm">{new Date(item.startedAt).toLocaleDateString()}</div>
//                       <div className="flex items-center gap-2">
//                         <div className={`px-2 py-1 rounded text-xs font-bold ${item.status === "completed" ? "bg-[#00f5a0]/20 text-[#00f5a0]" : "bg-[#ffd700]/20 text-[#ffd700]"}`}>
//                           {item.status}
//                         </div>
//                         <button
//                           onClick={() => handleDeleteInterview(item._id)}
//                           className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
//                           title="Delete interview session"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <div className="text-3xl font-bold text-white mb-1">
//                         {item.averageScore || "-"}
//                         <span className="text-lg text-gray-500">/10</span>
//                       </div>
//                       <div className="text-xs text-gray-400 uppercase tracking-wide">Average Score</div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-500 block">Questions</span>
//                         <span className="text-white font-semibold">{item.totalQuestions}</span>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-gray-500 block">Duration</span>
//                         <span className="text-white font-semibold">
//                           {item.completedAt
//                             ? Math.round((new Date(item.completedAt) - new Date(item.startedAt)) / 60000) + " min"
//                             : "-"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Interview;
