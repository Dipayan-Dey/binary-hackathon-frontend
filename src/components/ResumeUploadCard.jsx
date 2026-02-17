import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { uploadResume } from "../api/userApi";
import LoadingSpinner from "./LoadingSpinner";

const ResumeUploadCard = ({ onUploadSuccess, onUploadStart }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file) => {
    if (!file || !validateFile(file)) return;

    try {
      setUploading(true);
      if (onUploadStart) onUploadStart();

      const formData = new FormData();
      formData.append("resume", file);

      const response = await uploadResume(formData);

      if (response.data.success) {
        toast.success("Resume uploaded successfully!");
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
        dragActive
          ? "border-blue-400 bg-blue-500/10 scale-105"
          : "border-white/20 bg-white/5 hover:border-blue-400/50"
      } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="py-8">
          <LoadingSpinner size="lg" text="Uploading your resume..." />
          <p className="text-gray-400 text-sm mt-4">
            This may take a few seconds
          </p>
        </div>
      ) : (
        <>
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-4xl mx-auto mb-6 animate-bounce">
            ☁️
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            Upload Your Resume
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Drag and drop your resume here, or click to browse.
            <br />
            <span className="text-xs text-gray-500">
              Supported formats: PDF, DOCX • Max size: 10MB
            </span>
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={handleButtonClick}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Select File
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span> ATS Optimized
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span> AI Analysis
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Secure Upload
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeUploadCard;
