import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getResume,
  uploadResume,
  deleteResume,
  getAnalysisResults,
} from "../api/userApi";

const useResumeManagement = () => {
  const [resumeData, setResumeData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchResumeData = useCallback(async () => {
    try {
      setLoading(true);
      const resumeResponse = await getResume();

      if (resumeResponse.data.success && resumeResponse.data.data) {
        setResumeData(resumeResponse.data.data);

        // Fetch analysis if resume exists
        try {
          const analysisResponse = await getAnalysisResults();
          if (analysisResponse.data.success && analysisResponse.data.data) {
            setAnalysisData(analysisResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching analysis:", error);
        }
      } else {
        setResumeData(null);
        setAnalysisData(null);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setResumeData(null);
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  const handleUpload = async (file) => {
    if (!file) return { success: false };

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await uploadResume(formData);

      if (response.data.success) {
        setResumeData(response.data.data);
        toast.success("Resume uploaded successfully!");
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) {
      return { success: false, cancelled: true };
    }

    try {
      setLoading(true);
      const response = await deleteResume();

      if (response.data.success) {
        setResumeData(null);
        setAnalysisData(null);
        toast.success("Resume deleted successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchResumeData();
  };

  return {
    resumeData,
    analysisData,
    loading,
    uploading,
    handleUpload,
    handleDelete,
    refreshData,
    hasResume: !!resumeData,
    hasAnalysis: !!analysisData,
  };
};

export default useResumeManagement;
