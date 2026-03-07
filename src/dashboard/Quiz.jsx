import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  startQuiz,
  submitQuizAnswers,
  getQuizHistory,
  deleteQuiz,
} from "../api/userApi";
import { FileText, Rocket } from "lucide-react";
import "./styles/DashboardPages.css";
import Swal from "sweetalert2";

const Quiz = () => {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // track which item is being deleted
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [view, setView] = useState("start"); // start, quiz, result, history

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getQuizHistory();
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      setLoading(true);
      const response = await startQuiz({});
      if (response.data.success) {
        console.log("Quiz Session Data:", response.data.data);
        setSession(response.data.data);
        setView("quiz");
        setAnswers({});
        setResults(null);
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error(error.response?.data?.message || "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < session.questions.length) {
      toast.warning("Please answer all questions before submitting");
      return;
    }

    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([index, answer]) => ({
          questionIndex: parseInt(index),
          answer: answer,
        }),
      );

      const response = await submitQuizAnswers(session.sessionId, {
        answers: formattedAnswers,
      });

      if (response.data.success) {
        setResults(response.data.data);
        setView("result");
        loadHistory();
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (sessionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This quiz history will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff006e",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(sessionId); // show spinner on the specific card
      await deleteQuiz(sessionId);

      // ✅ Only update state locally — no loadHistory() call needed
      setHistory((prev) => prev.filter((item) => item._id !== sessionId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Quiz deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to delete quiz",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Only show full-page loader for initial load or quiz start, NOT during delete
  if (loading && view !== "history") {
    return (
      <div className="dashboard-page flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Skill Assessment Quiz</h1>
          <p className="page-subtitle">
            Test your knowledge and verify your skills
          </p>
        </div>

        {view !== "quiz" && (
          <button
            onClick={() => setView(view === "history" ? "start" : "history")}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00f5a0] border border-[#00f5a0]/30 hover:shadow-[0_0_10px_rgba(0,245,160,0.2)] transition-all"
          >
            {view === "history" ? "Take New Quiz" : "View History"}
          </button>
        )}
      </div>

      {view === "start" && (
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-gradient-to-br from-[#002b1d]/80 to-[#001e2b]/90 rounded-2xl p-10 border border-[#00f5a0]/30 text-center shadow-[0_0_30px_rgba(0,245,160,0.2)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f5a0] to-transparent opacity-50"></div>
            <div className="w-24 h-24 bg-[#00f5a0]/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(0,245,160,0.4)] animate-pulse">
              <FileText className="w-12 h-12 text-[#00f5a0]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(0,245,160,0.5)]">
              Ready to test your skills?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Take a quick quiz to validate the skills on your profile.
              Questions are generated based on your listed technologies.
            </p>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-4 bg-gradient-to-r from-[#00f5a0] to-[#00d9ff] hover:from-[#00db8e] hover:to-[#00b8e6] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,245,160,0.5)] text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <Rocket className="w-6 h-6" /> Start Quiz
            </button>
          </div>
        </div>
      )}

      {view === "quiz" && session && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="space-y-8">
            {session.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  <span className="text-[#00f5a0] mr-2">{qIndex + 1}.</span>
                  {q.question}
                </h3>

                <div className="space-y-3">
                  {q.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${answers[qIndex] === option ? "bg-[#00f5a0]/20 border-[#00f5a0]/50 shadow-[0_0_10px_rgba(0,245,160,0.2)]" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={answers[qIndex] === option}
                        onChange={() => handleOptionSelect(qIndex, option)}
                        className="form-radio text-[#00f5a0] focus:ring-[#00f5a0] h-5 w-5 mr-3 bg-gray-700 border-gray-600"
                      />
                      <span className="text-gray-200">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 pb-12">
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-8 py-4 bg-[#00f5a0] hover:bg-[#00c785] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,245,160,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <div className="spinner w-4 h-4 border-white"></div>
                ) : (
                  "Submit Quiz"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "result" && results && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-gradient-to-br from-[#002b1d]/80 to-[#001e2b]/90 rounded-3xl p-8 border border-[#00f5a0]/30 backdrop-blur-sm mb-8 text-center shadow-[0_0_30px_rgba(0,245,160,0.2)]">
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Results</h2>
            <div className="text-6xl font-bold text-[#00f5a0] my-6 drop-shadow-[0_0_15px_rgba(0,245,160,0.5)]">
              {results.score}%
            </div>
            <p className="text-xl text-gray-300 mb-8">
              You got{" "}
              <span className="text-white font-bold">
                {results.correctAnswers}
              </span>{" "}
              out of{" "}
              <span className="text-white font-bold">
                {results.totalQuestions}
              </span>{" "}
              questions correct.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setView("history")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
              >
                View History
              </button>
              <button
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-[#00f5a0] hover:bg-[#00c785] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,245,160,0.4)]"
              >
                Take Another Quiz
              </button>
            </div>
          </div>

          <div className="space-y-6 pb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Detailed Review
            </h3>
            {results.questions.map((q, index) => (
              <div
                key={index}
                className={`bg-white/5 rounded-2xl p-6 border ${q.isCorrect ? "border-[#00f5a0]/30" : "border-[#ff006e]/30"}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${q.isCorrect ? "bg-[#00f5a0] text-black" : "bg-[#ff006e] text-white"}`}
                  >
                    {q.isCorrect ? "✓" : "✕"}
                  </div>
                  <h3 className="text-lg font-bold text-white">{q.question}</h3>
                </div>

                <div className="space-y-2 ml-9">
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-gray-400 text-sm block mb-1">
                      Your Answer:
                    </span>
                    <span
                      className={`font-semibold ${q.isCorrect ? "text-[#00f5a0]" : "text-[#ff006e]"}`}
                    >
                      {q.userAnswer}
                    </span>
                  </div>
                  {!q.isCorrect && (
                    <div className="p-3 rounded-lg bg-[#00f5a0]/10 border border-[#00f5a0]/20">
                      <span className="text-gray-400 text-sm block mb-1">
                        Correct Answer:
                      </span>
                      <span className="text-[#00f5a0] font-semibold">
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="mt-8">
          {/* ✅ Loading overlay for history page during initial fetch */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 text-lg mb-4">
                No quiz history found.
              </p>
              <button
                onClick={() => setView("start")}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00f5a0] border border-[#00f5a0]/30 hover:shadow-[0_0_10px_rgba(0,245,160,0.2)] transition-all cursor-pointer"
              >
                Take your first quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#00f5a0]/50 transition-colors group relative"
                >
                  {/* ✅ Per-card loading overlay while deleting */}
                  {deletingId === item._id && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10">
                      <div className="spinner"></div>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="text-gray-400 text-sm">
                      {new Date(item.startedAt).toLocaleDateString()}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold ${item.score >= 70 ? "bg-[#00f5a0]/20 text-[#00f5a0]" : item.score >= 40 ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-[#ff006e]/20 text-[#ff006e]"}`}
                    >
                      {item.score}% Score
                    </div>
                    <div>
                      <button
                        className="text-red-500 hover:text-red-600 text-sm font-semibold disabled:opacity-40"
                        onClick={() => handleDeleteQuiz(item._id)}
                        disabled={deletingId === item._id}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white mb-1">
                      {item.correctAnswers}
                      <span className="text-lg text-gray-500">
                        /{item.totalQuestions}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                      Correct Answers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;