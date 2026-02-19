import React, { useState, useRef, useEffect } from "react";
// import chatbotService from "../services/chatbotService";
import "./styles/chat-bot.css";
import { chatbotService } from "../api/userApi";
import UserProfile from "../hooks/UserProfile";
import { BrushCleaning, Loader2, Send } from "lucide-react";

// ─── Lightweight Markdown Renderer ───────────────────────────────────────────
const renderMarkdown = (text) => {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // H1
    if (/^# (.+)/.test(line)) {
      elements.push(
        <h1 key={i} className="md-h1">
          {parseInline(line.replace(/^# /, ""))}
        </h1>,
      );
      i++;
      continue;
    }

    // H2
    if (/^## (.+)/.test(line)) {
      elements.push(
        <h2 key={i} className="md-h2">
          {parseInline(line.replace(/^## /, ""))}
        </h2>,
      );
      i++;
      continue;
    }

    // H3
    if (/^### (.+)/.test(line)) {
      elements.push(
        <h3 key={i} className="md-h3">
          {parseInline(line.replace(/^### /, ""))}
        </h3>,
      );
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^[-*+] /, ""))}</li>,
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="md-ul">
          {items}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^\d+\. /, ""))}</li>,
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="md-ol">
          {items}
        </ol>,
      );
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={`code-${i}`} className="md-code-block">
          {lang && <span className="md-code-lang">{lang}</span>}
          <pre>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^> /, ""));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="md-blockquote">
          {quoteLines.map((l, idx) => (
            <p key={idx}>{parseInline(l)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="md-hr" />);
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="md-p">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return elements;
};

// Parse inline markdown: bold, italic, code, links
const parseInline = (text) => {
  if (!text) return null;
  const parts = [];
  // Combined regex for **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[0].startsWith("**")) {
      parts.push(
        <strong key={match.index} className="md-bold">
          {match[2]}
        </strong>,
      );
    } else if (match[0].startsWith("*")) {
      parts.push(
        <em key={match.index} className="md-italic">
          {match[3]}
        </em>,
      );
    } else if (match[0].startsWith("`")) {
      parts.push(
        <code key={match.index} className="md-inline-code">
          {match[4]}
        </code>,
      );
    } else if (match[0].startsWith("[")) {
      parts.push(
        <a
          key={match.index}
          href={match[6]}
          className="md-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[5]}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : text;
};

// ─── Message Content Component ────────────────────────────────────────────────
const MessageContent = ({ content, role }) => {
  if (role === "user") {
    return <p className="md-p">{content}</p>;
  }
  return <div className="markdown-body">{renderMarkdown(content)}</div>;
};

// ─── Main Chatbot Component ───────────────────────────────────────────────────
const Chatbot = () => {
  const { profile } = UserProfile();
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hi! I'm your **AI Career Assistant**.\n\nI can help you with:\n- **Career advice** and planning\n- **Resume improvements**\n- **Interview preparation**\n- **Skill gap analysis**\n\nAsk me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 150) + "px";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(input);
      const botMessage = {
        role: "bot",
        content: response.data.message,
        timestamp: response.data.timestamp,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
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
    textareaRef.current?.focus();
  };

  const suggestedPrompts = [
    "What are my strongest skills?",
    "How can I improve my resume?",
    "Tell me about my GitHub projects",
    "Help me prepare for an interview",
    "What career path should I pursue?",
    "Review my profile",
  ];

  const userInitial = profile?.data?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="flex flex-col justify-center items-left text-left gap-2">
          <h2 className="text-xl font-bold text-white">
            🤖 AI Career Assistant
          </h2>

          <p className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-2 rounded-lg max-w-md">
            ⚠ Note: Your chat data is not stored in the database. If you refresh
            the website, your chat history will be lost.
          </p>
        </div>

        <button onClick={clearChat} className="clear-btn" title="Clear chat">
          <BrushCleaning className="w-4 h-4" />
          <span>Clear</span>
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
              {msg.role === "user" ? userInitial : "🤖"}
            </div>
            <div className="message-content">
              <MessageContent content={msg.content} role={msg.role} />
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your career…"
            maxLength={2000}
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="send-label">Send</span>
          </button>
        </div>
        <div className="input-footer">
          <span className="char-count">
            {input.length}/2000 · Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
