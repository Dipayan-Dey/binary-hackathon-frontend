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
      {/* Icon with spinning arc ring */}
      <div className="refresh-icon-wrap">
        <span className="refresh-arc" />
        <RefreshCw className="refresh-icon" />
      </div>

      {/* Text label */}
      <span className="refresh-label">
        {loading ? "Syncing" : "Refresh"}
      </span>
    </button>
  );
};

export default RefreshButton;