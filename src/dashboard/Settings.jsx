import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./DashboardPages.css";
import "./Settings.css";
import { useTheme } from "../context/ThemeContext";

const API_URL =
  import.meta.env.BACKEND_API_ENDPOINT ||
  "https://readynx-backend-ts.onrender.com/api/v1";

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
  const { theme, setTheme } = useTheme();

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    language: "en",
    compactMode: false,
  });

  // Sync local state with context when theme changes externally or on load
  useEffect(() => {
    setAppearanceSettings((prev) => ({ ...prev, theme }));
  }, [theme]);

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
      <div className="settings-tabs">
        <button
          onClick={() => setActiveTab("profile")}
          className={`settings-tab-btn ${activeTab === "profile" ? "active" : ""}`}
        >
          👤 Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`settings-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
        >
          🔔 Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`settings-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
        >
          🔒 Privacy
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`settings-tab-btn ${activeTab === "appearance" ? "active" : ""}`}
        >
          🎨 Appearance
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="settings-container">
          <div className="settings-card">
            <h3 className="settings-title">Profile Information</h3>

            <div className="settings-form-group">
              <div className="settings-form-group">
                <label className="settings-label">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="settings-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="settings-input"
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="settings-input"
                  style={{
                    minHeight: "100px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <span
                  className="settings-item-desc"
                  style={{ marginTop: "0.25rem", display: "block" }}
                >
                  {profileData.bio.length}/500
                </span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  className="settings-input"
                  placeholder="City, Country"
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Website</label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) =>
                    setProfileData({ ...profileData, website: e.target.value })
                  }
                  className="settings-input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={saving}
              className="settings-btn"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="settings-container">
          <div className="settings-card">
            <h3 className="settings-title">Notification Preferences</h3>

            <div className="settings-form-group">
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
                <div key={item.key} className="settings-item">
                  <div>
                    <div className="settings-item-title">{item.label}</div>
                    <div className="settings-item-desc">{item.desc}</div>
                  </div>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key]}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked,
                        })
                      }
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleNotificationSave}
              disabled={saving}
              className="settings-btn"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === "privacy" && (
        <div className="settings-container">
          <div className="settings-card">
            <h3 className="settings-title">Privacy & Security</h3>

            <div className="settings-form-group">
              <div className="settings-form-group">
                <label className="settings-label">Profile Visibility</label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="settings-select"
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
                <div key={item.key} className="settings-item">
                  <div>
                    <div className="settings-item-title">{item.label}</div>
                    <div className="settings-item-desc">{item.desc}</div>
                  </div>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={privacySettings[item.key]}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          [item.key]: e.target.checked,
                        })
                      }
                    />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handlePrivacySave}
              disabled={saving}
              className="settings-btn"
            >
              {saving ? "Saving..." : "Save Privacy Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === "appearance" && (
        <div className="settings-container">
          <div className="settings-card">
            <h3 className="settings-title">Appearance & Display</h3>

            <div className="settings-form-group">
              <div className="settings-form-group">
                <label className="settings-label">Theme</label>
                <select
                  value={appearanceSettings.theme}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setTheme(newTheme);
                    setAppearanceSettings({
                      ...appearanceSettings,
                      theme: newTheme,
                    });
                  }}
                  className="settings-select"
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

              <div className="settings-form-group">
                <label className="settings-label">Language</label>
                <select
                  value={appearanceSettings.language}
                  onChange={(e) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      language: e.target.value,
                    })
                  }
                  className="settings-select"
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

              <div className="settings-item">
                <div>
                  <div className="settings-item-title">Compact Mode</div>
                  <div className="settings-item-desc">
                    Reduce spacing for a denser layout
                  </div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={appearanceSettings.compactMode}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        compactMode: e.target.checked,
                      })
                    }
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
            </div>

            <button
              onClick={handleAppearanceSave}
              disabled={saving}
              className="settings-btn"
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
