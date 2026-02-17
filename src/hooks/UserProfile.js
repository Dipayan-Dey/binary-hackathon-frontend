import { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProfile();
      setProfile(response.data); // Structure: { success: true, data: { ... } }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile: loadProfile,
  };
}
