import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authApi";
// import { fetchUserProfile } from "../api/Authapi";
// import { fetchUserProfile } from "../api/authApi";  // adjust path if needed

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUserProfile();
      setProfile(data.user || data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load profile"
      );
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