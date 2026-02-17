import React from "react";
import { Loader2 } from "lucide-react";
import "./LoadingScreen.css";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="loading-screen-overlay">
      <div className="loading-screen-content">
        <div className="loading-spinner">
          <Loader2 className="spinner-icon" />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
