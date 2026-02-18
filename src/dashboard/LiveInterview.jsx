import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  startLiveInterview,
  submitLiveInterviewAnswer,
  finishLiveInterview,
  getLiveInterviewSession,
} from "../api/userApi";
import LoadingScreen from "../components/LoadingScreen";
import { Mic, MicOff, Volume2, Globe, Sparkles } from "lucide-react";
import "./styles/DashboardPages.css";

const getQuestionText = (q) => {
  if (typeof q === "object" && q !== null && q.question) {
    return q.question;
  }
  return q;
};

const LiveInterview = () => {
  const [loading, setLoading] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [view, setView] = useState("start"); // start, interview, result

  // Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

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

    recognitionRef.current.onstart = () => setIsListening(true);

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswer((prev) =>
          prev ? prev + " " + finalTranscript : finalTranscript,
        );
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error(`Voice input error: ${event.error}`);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleStartInterview = async () => {
    try {
      setStartingInterview(true);
      const response = await startLiveInterview();

      if (response.data.success) {
        setSession(response.data.data);
        setCurrentQuestion(getQuestionText(response.data.data.firstQuestion));
        setCurrentQuestionIndex(0);
        setView("interview");
        setAnswer("");
        setFeedback(null);

        // Auto-read the first question
        speakText(getQuestionText(response.data.data.firstQuestion));
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error(error.response?.data?.message || "Failed to start interview");
    } finally {
      setStartingInterview(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.warning("Please provide an answer");
      return;
    }

    try {
      setSubmitting(true);
      stopListening();

      const response = await submitLiveInterviewAnswer(
        session.sessionId,
        answer,
      );

      if (response.data.success) {
        setFeedback(response.data.data);

        // If there is a next question, prepare it (but don't show yet until user clicks next)
        if (response.data.nextQuestion) {
          // We might want to store next question to show after feedback review
          // But existing logic in Interview.jsx showed feedback then "Next Question" button
        }

        // Check if we strictly follow the flow
        // The backend returns `nextQuestion`
        if (response.data.nextQuestion) {
          // Store it temporarily?
          // Actually, we can just update the current question state when user clicks "Next"
          // But we need to store it somewhere.
          // Let's store it in a ref or state.
          // For now, let's keep it simple: just show feedback.
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    // We need to fetch the next question or use the one returned from submit
    // Since my backend `submitAnswer` returns `nextQuestion`, I should have stored it.
    // Let's refetch session details to be safe and get the current question index/content correctly
    try {
      setLoading(true);
      const response = await getLiveInterviewSession(session.sessionId);
      if (response.data.success) {
        const data = response.data.data;
        if (data.isCompleted) {
          await handleFinishInterview();
        } else {
          setSession(data); // updates everything
          setCurrentQuestion(getQuestionText(data.currentQuestion)); // Verify if backend `getSessionDetails` returns `currentQuestion`
          setCurrentQuestionIndex(data.currentQuestionIndex);
          setAnswer("");
          setFeedback(null);
          speakText(getQuestionText(data.currentQuestion));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      setLoading(true);
      stopListening();
      const response = await finishLiveInterview(session.sessionId);
      if (response.data.success) {
        setSession({ ...session, report: response.data.data });
        setView("result");
      }
    } catch (error) {
      console.error("Error finishing interview:", error);
      toast.error("Failed to finish interview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading..." />;

  return (
    <div className="dashboard-page relative min-h-screen">
      {startingInterview && (
        <LoadingScreen message="Initializing AI Interviewer..." />
      )}

      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <Globe className="w-8 h-8 text-[#00d9ff]" />
          Live AI Interview
        </h1>
        <p className="page-subtitle text-gray-400">
          Real-time voice interaction with AI for realistic interview practice.
        </p>
      </div>

      {view === "start" && (
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-br from-[#1a103c] to-[#2d1b69] rounded-3xl p-12 border border-[#a855f7]/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="relative z-10">
              <div className="w-32 h-32 bg-[#a855f7]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 border-2 border-[#a855f7]/30 rounded-full animate-ping opacity-20"></div>
                <Mic className="w-16 h-16 text-[#a855f7]" />
              </div>

              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Speak?
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Experience a simulated interview environment. The AI will ask
                questions verbally, and you can respond with your voice. Get
                instant evaluation on your communication and technical accuracy.
              </p>

              <button
                onClick={handleStartInterview}
                className="px-10 py-5 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] text-white font-bold rounded-2xl text-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Start Live Session <Sparkles className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "interview" && session && (
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of{" "}
                {session.questions?.length || session.totalQuestions}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) /
                    (session.questions?.length || session.totalQuestions)) *
                    100,
                )}
                % Completed
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d9ff] to-[#a855f7] transition-all duration-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / (session.questions?.length || session.totalQuestions)) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="grid gap-6">
            {/* AI Question Section */}
            <div
              className={`p-8 rounded-2xl border transition-all duration-500 ${isSpeaking ? "bg-[#a855f7]/10 border-[#a855f7]/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "bg-white/5 border-white/10"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider text-[#a855f7] uppercase bg-[#a855f7]/10 px-3 py-1 rounded-full">
                  AI Interviewer
                </span>
                <button
                  onClick={() => speakText(currentQuestion)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <h3 className="text-2xl font-medium text-white leading-relaxed">
                {currentQuestion}
              </h3>
              {isSpeaking && (
                <div className="flex gap-1 mt-4 h-4 items-end">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#a855f7] animate-pulse"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Section */}
            {!feedback ? (
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10 relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer or speak..."
                  className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none min-h-[150px] resize-none"
                />

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isListening ? "bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={18} /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic size={18} /> Start Recording
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="px-8 py-3 bg-[#00d9ff] hover:bg-[#00c2e6] text-[#0f172a] font-bold rounded-xl transition-all shadow-lg hover:shadow-[#00d9ff]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-2">Your Answer</h4>
                  <div className="bg-black/30 p-4 rounded-xl text-gray-300 italic border-l-2 border-gray-600">
                    "{answer}"
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border mb-8 ${feedback.score >= 7 ? "bg-green-500/10 border-green-500/30" : feedback.score >= 4 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`text-2xl font-bold ${feedback.score >= 7 ? "text-green-400" : feedback.score >= 4 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {feedback.score}/10
                    </div>
                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                      Evaluation Score
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    {feedback.feedback}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 bg-white text-[#0f172a] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    {currentQuestionIndex <
                    (session.questions?.length || session.totalQuestions) - 1
                      ? "Next Question →"
                      : "Finish Interview"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === "result" && session && (
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-[#1a103c] to-[#2d1b69] rounded-3xl p-10 border border-[#a855f7]/30 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent"></div>

            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Interview Completed!
            </h2>
            <p className="text-gray-400 mb-10">
              You've successfully completed the live interview session.
            </p>

            {/* Minimal Report for now - can be expanded */}
            {session.report && (
              <div className="bg-white/5 rounded-xl p-8 text-left mb-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">
                  Overall Feedback
                </h3>
                <div className="prose prose-invert max-w-none">
                  {/* Assuming report is a string or object. Prompt code returns `report` from `generateFinalReport` which is likely a string or structured data. */}
                  {typeof session.report === "string" ? (
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {session.report}
                    </p>
                  ) : (
                    <pre className="text-gray-300 font-sans whitespace-pre-wrap">
                      {JSON.stringify(session.report, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setView("start")}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/10"
            >
              Back to Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveInterview;
