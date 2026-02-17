import React from "react";
import { RefreshCw } from "lucide-react";
import "./RefreshButton.css";

const RefreshButton = ({ onClick, loading = false }) => {
  return (
    <button
      className={`refresh-button ${loading ? "loading" : ""}`}
      onClick={onClick}
      disabled={loading}
      title="Refresh"
    >
      <RefreshCw className="refresh-icon" />
    </button>
  );
};

export default RefreshButton;
