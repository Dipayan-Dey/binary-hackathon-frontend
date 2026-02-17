import React from "react";

const LoadingSpinner = ({ size = "md", text = "", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
