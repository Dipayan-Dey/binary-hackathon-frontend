import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  startLiveInterview,
  submitLiveInterviewAnswer,
  completeLiveInterview,
  getLiveInterviewQuestionAudio,
} from "../api/userApi";
import LoadingScreen from "../components/LoadingScreen";
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from "lucide-react";
import "./styles/DashboardPages.css";

const getQuestionText = (q) => {
  if (typeof q === "object" && q !== null && q.question) {
    return q.question;
  }
  return q;
};

const LiveInterview = () => {
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState("start"); // start, interview, result

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        // Append purely to show functionality, but typically we want to set it
        // The provided example sets it directly. Let's follow that but enable appending if desired in future.
        // For now, mirroring the provided clear example logic of "current session result"
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            // interim
          }
        }

        if (finalTranscript) {
          setAnswer((prev) =>
            prev ? prev + " " + finalTranscript : finalTranscript,
          );
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === "no-speech") {
          toast.info(
            "No speech detected. Please speak louder or check your microphone.",
          );
        } else if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          toast.error(
            "Microphone access denied. Please allow microphone access.",
          );
        } else {
          toast.error(`Voice input error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  // Play audio or fallback to TTS
  const playQuestionAudio = async (sid, index, text) => {
    try {
      const questionText = getQuestionText(text);
      const response = await getLiveInterviewQuestionAudio(sid, index);

      // Check if blob is valid audio (sometimes 503 returns JSON blob)
      if (response && response.data && response.data.type.includes("audio")) {
        const audioUrl = URL.createObjectURL(response.data);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } else {
        // Fallback if data isn't audio
        speakText(questionText);
      }
    } catch (err) {
      console.error("Audio fetch error, falling back to TTS:", err);
      speakText(getQuestionText(text));
    }
  };

  const speakText = (text) => {
    if (synthesisRef.current.speaking) synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    synthesisRef.current.speak(utterance);
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await startLiveInterview();
      if (response.data.success) {
        const data = response.data.data;
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setView("interview");

        // Load/Play first question
        if (data.questions && data.questions.length > 0) {
          const firstQuestionText = data.questions[0];
          await playQuestionAudio(data.sessionId, 0, firstQuestionText);
        }
      } else {
        toast.error(response.data.message || "Failed to start interview");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.warning("Please provide an answer");
      return;
    }

    setLoading(true);
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    try {
      const response = await submitLiveInterviewAnswer(
        sessionId,
        currentQuestionIndex,
        answer,
      );

      if (response.data.success) {
        setEvaluation(response.data.data.evaluation);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setEvaluation(null);
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      playQuestionAudio(sessionId, nextIndex, questions[nextIndex]);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    setLoading(true);
    try {
      const response = await completeLiveInterview(sessionId);
      if (response.data.success) {
        setReport(response.data.data.report);
        setView("result");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete interview");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sessionId) return <LoadingScreen message="Initializing..." />;

  return (
    <div className="dashboard-page relative min-h-screen">
      <audio ref={audioRef} className="hidden" />

      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          Live AI Interview
        </h1>
        <p className="page-subtitle text-gray-400">
          Real-time voice interaction with AI for realistic interview practice.
        </p>
      </div>

      {view === "start" && (
        <div className="max-w-3xl mx-auto mt-12 text-center">
          {/* Start Screen UI similar to before */}
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
                questions verbally, and you can respond with your voice.
              </p>

              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="px-10 py-5 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] text-white font-bold rounded-2xl text-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                {loading ? "Starting..." : "Start Live Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "interview" && (
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / questions.length) * 100,
                )}
                % Completed
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d9ff] to-[#a855f7] transition-all duration-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Question Card */}
            <div className="p-8 rounded-2xl border bg-white/5 border-white/10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider text-[#a855f7] uppercase bg-[#a855f7]/10 px-3 py-1 rounded-full">
                  AI Interviewer
                </span>
                <button
                  onClick={() => {
                    if (questions[currentQuestionIndex]) {
                      playQuestionAudio(
                        sessionId,
                        currentQuestionIndex,
                        questions[currentQuestionIndex],
                      );
                    }
                  }}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <h3 className="text-2xl font-medium text-white leading-relaxed">
                {getQuestionText(questions[currentQuestionIndex])}
              </h3>
            </div>

            {/* Answer / Feedback Section */}
            {!evaluation ? (
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10 relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer or speak..."
                  className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none min-h-[150px] resize-none"
                />
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isRecording ? "bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
                  >
                    {isRecording ? (
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
                    disabled={loading || !answer.trim()}
                    className="px-8 py-3 bg-[#00d9ff] hover:bg-[#00c2e6] text-[#0f172a] font-bold rounded-xl transition-all shadow-lg hover:shadow-[#00d9ff]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : null}
                    {loading ? "Submitting..." : "Submit Answer"}
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
                  className={`p-6 rounded-xl border mb-8 ${evaluation.technicalScore >= 7 ? "bg-green-500/10 border-green-500/30" : evaluation.technicalScore >= 4 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}
                >
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xl font-bold ${evaluation.technicalScore >= 7 ? "text-green-400" : evaluation.technicalScore >= 4 ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {evaluation.technicalScore}/10
                      </span>
                      <span className="text-sm text-gray-400 uppercase">
                        Technical
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xl font-bold ${evaluation.communicationScore >= 7 ? "text-green-400" : evaluation.communicationScore >= 4 ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {evaluation.communicationScore}/10
                      </span>
                      <span className="text-sm text-gray-400 uppercase">
                        Communication
                      </span>
                    </div>
                  </div>

                  {evaluation.improvementSuggestions && (
                    <div className="mt-4">
                      <h5 className="text-sm font-bold text-gray-300 mb-2">
                        Suggestions:
                      </h5>
                      <ul className="list-disc list-inside text-gray-400 space-y-1">
                        {evaluation.improvementSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.followUpQuestion && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h5 className="text-sm font-bold text-[#00d9ff] mb-1">
                        Follow-up:
                      </h5>
                      <p className="text-gray-300 italic">
                        {evaluation.followUpQuestion}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 bg-white text-[#0f172a] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? "Next Question →"
                      : "Finish Interview"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === "result" && report && (
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-[#1a103c] to-[#2d1b69] rounded-3xl p-10 border border-[#a855f7]/30 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent"></div>
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Interview Completed!
            </h2>

            <div className="bg-white/5 rounded-xl p-8 text-left mb-8 border border-white/10 mt-8">
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-[#00d9ff]">
                    {report.overallTechnicalScore}
                  </div>
                  <div className="text-xs text-gray-400 uppercase mt-1">
                    Technical
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-[#a855f7]">
                    {report.communicationScore}
                  </div>
                  <div className="text-xs text-gray-400 uppercase mt-1">
                    Communication
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-[#ff006e]">
                    {report.confidenceScore}
                  </div>
                  <div className="text-xs text-gray-400 uppercase mt-1">
                    Confidence
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-green-400 font-bold mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {report.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-bold mb-2">
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {report.improvementAreas.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#00d9ff] font-bold mb-2">Roadmap</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {report.roadmapSuggestion.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

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
