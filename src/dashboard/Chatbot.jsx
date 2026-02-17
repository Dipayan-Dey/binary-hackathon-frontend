
import React, { useState, useRef, useEffect } from "react";
// import chatbotService from "../services/chatbotService";
import "./styles/chat-bot.css";
import { chatbotService } from "../api/userApi";
import UserProfile from "../hooks/UserProfile";

const Chatbot = () => {
  const {profile}=UserProfile()
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hi! I'm your AI career assistant Design By Dipayan Dey Sir. I can help you with career advice, resume improvements, interview preparation, and more. Ask me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(input);

      // Add bot response to UI
      const botMessage = {
        role: "bot",
        content: response.data.message,
        timestamp: response.data.timestamp,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Add error message
      const errorMessage = {
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const useSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  const suggestedPrompts = [
    "What are my strongest skills?",
    "How can I improve my resume?",
    "Tell me about my GitHub projects",
    "Help me prepare for an interview",
    "What career path should I pursue?",
    "Review my profile",
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>🤖 AI Career Assistant</h2>
        <button onClick={clearChat} className="clear-btn" title="Clear chat">
          🗑️ Clear
        </button>
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="suggested-prompts">
          <p className="prompts-title">Try asking:</p>
          <div className="prompts-grid">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => useSuggestedPrompt(prompt)}
                className="prompt-btn"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role} ${msg.isError ? "error" : ""}`}
          >
            <div className="message-avatar">
              {msg.role === "user" ? `${profile?.data?.user?.name?.charAt(0).toUpperCase()}` : "🤖"}
            </div>
            <div className="message-content">
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot loading-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your career, skills, or projects..."
          maxLength={2000}
          rows={1}
          disabled={loading}
        />
        <div className="input-footer">
          <span className="char-count">{input.length}/2000</span>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            {loading ? "⏳" : "📤"} Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

