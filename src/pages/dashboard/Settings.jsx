import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./DashboardPages.css";

const API_URL =
  import.meta.env.BACKEND_API_ENDPOINT || "http://localhost:5000/api/v1";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    projectUpdates: true,
    skillRecommendations: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowIndexing: true,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    language: "en",
    compactMode: false,
  });

  // Load user settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/user/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProfileData(data.data.profile || profileData);
          setNotificationSettings(
            data.data.notifications || notificationSettings,
          );
          setPrivacySettings(data.data.privacy || privacySettings);
          setAppearanceSettings(data.data.appearance || appearanceSettings);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section, data) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section, data }),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSave = () => {
    saveSettings("profile", profileData);
  };

  const handleNotificationSave = () => {
    saveSettings("notifications", notificationSettings);
  };

  const handlePrivacySave = () => {
    saveSettings("privacy", privacySettings);
  };

  const handleAppearanceSave = () => {
    saveSettings("appearance", appearanceSettings);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "3rem" }}
        >
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Settings Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            background:
              activeTab === "profile"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "profile"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color:
              activeTab === "profile" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          👤 Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          style={{
            background:
              activeTab === "notifications"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "notifications"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color:
              activeTab === "notifications"
                ? "#fff"
                : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          🔔 Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          style={{
            background:
              activeTab === "privacy"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "privacy"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color:
              activeTab === "privacy" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          🔒 Privacy
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          style={{
            background:
              activeTab === "appearance"
                ? "rgba(99, 102, 241, 0.2)"
                : "transparent",
            border: "none",
            borderBottom:
              activeTab === "appearance"
                ? "2px solid #6366f1"
                : "2px solid transparent",
            color:
              activeTab === "appearance" ? "#fff" : "rgba(255, 255, 255, 0.6)",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "-2px",
          }}
        >
          🎨 Appearance
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
              }}
            >
              Profile Information
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    minHeight: "100px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255, 255, 255, 0.5)",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {profileData.bio.length}/500
                </span>
              </div>

              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) =>
                    setProfileData({ ...profileData, website: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={saving}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                background: "#6366f1",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
              }}
            >
              Notification Preferences
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  desc: "Receive notifications via email",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  desc: "Receive push notifications in your browser",
                },
                {
                  key: "weeklyDigest",
                  label: "Weekly Digest",
                  desc: "Get a weekly summary of your activity",
                },
                {
                  key: "projectUpdates",
                  label: "Project Updates",
                  desc: "Get notified when your projects are analyzed",
                },
                {
                  key: "skillRecommendations",
                  label: "Skill Recommendations",
                  desc: "Receive personalized skill suggestions",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "24px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key]}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked,
                        })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: notificationSettings[item.key]
                          ? "#6366f1"
                          : "rgba(255, 255, 255, 0.2)",
                        transition: "0.4s",
                        borderRadius: "24px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          content: '""',
                          height: "18px",
                          width: "18px",
                          left: notificationSettings[item.key] ? "26px" : "4px",
                          bottom: "3px",
                          background: "white",
                          transition: "0.4s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleNotificationSave}
              disabled={saving}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                background: "#6366f1",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === "privacy" && (
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
              }}
            >
              Privacy & Security
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Profile Visibility
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      profileVisibility: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  <option
                    value="public"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    Public - Anyone can view
                  </option>
                  <option
                    value="private"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    Private - Only you
                  </option>
                  <option
                    value="connections"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    Connections Only
                  </option>
                </select>
              </div>

              {[
                {
                  key: "showEmail",
                  label: "Show Email Address",
                  desc: "Display your email on your public profile",
                },
                {
                  key: "showLocation",
                  label: "Show Location",
                  desc: "Display your location on your profile",
                },
                {
                  key: "allowIndexing",
                  label: "Search Engine Indexing",
                  desc: "Allow search engines to index your profile",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "24px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={privacySettings[item.key]}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          [item.key]: e.target.checked,
                        })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: privacySettings[item.key]
                          ? "#6366f1"
                          : "rgba(255, 255, 255, 0.2)",
                        transition: "0.4s",
                        borderRadius: "24px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          content: '""',
                          height: "18px",
                          width: "18px",
                          left: privacySettings[item.key] ? "26px" : "4px",
                          bottom: "3px",
                          background: "white",
                          transition: "0.4s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handlePrivacySave}
              disabled={saving}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                background: "#6366f1",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Privacy Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === "appearance" && (
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
              }}
            >
              Appearance & Display
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Theme
                </label>
                <select
                  value={appearanceSettings.theme}
                  onChange={(e) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      theme: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  <option
                    value="dark"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🌙 Dark Mode
                  </option>
                  <option
                    value="light"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    ☀️ Light Mode
                  </option>
                  <option
                    value="auto"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🔄 Auto (System)
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Language
                </label>
                <select
                  value={appearanceSettings.language}
                  onChange={(e) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      language: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  <option
                    value="en"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🇬🇧 English
                  </option>
                  <option
                    value="es"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🇪🇸 Español
                  </option>
                  <option
                    value="fr"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🇫🇷 Français
                  </option>
                  <option
                    value="de"
                    style={{ background: "#1a1a2e", color: "#fff" }}
                  >
                    🇩🇪 Deutsch
                  </option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Compact Mode
                  </div>
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Reduce spacing for a denser layout
                  </div>
                </div>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={appearanceSettings.compactMode}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        compactMode: e.target.checked,
                      })
                    }
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: appearanceSettings.compactMode
                        ? "#6366f1"
                        : "rgba(255, 255, 255, 0.2)",
                      transition: "0.4s",
                      borderRadius: "24px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: '""',
                        height: "18px",
                        width: "18px",
                        left: appearanceSettings.compactMode ? "26px" : "4px",
                        bottom: "3px",
                        background: "white",
                        transition: "0.4s",
                        borderRadius: "50%",
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleAppearanceSave}
              disabled={saving}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                background: "#6366f1",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Appearance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
