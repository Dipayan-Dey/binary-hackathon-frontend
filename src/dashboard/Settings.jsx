import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./styles/DashboardPages.css";
import "./styles/Settings.css";
import { useTheme } from "../context/ThemeContext";
import {
  updatePersonalInformation,
  updateProfile,
  updateSettings,
  // disconnectLinkedIn,
  // disconnectGitHub,
} from "../api/userApi";
import UserProfile from "../hooks/UserProfile";
import { User, Bell, Lock, Palette, Sun, Moon, Monitor } from "lucide-react";
// import { useProfile } from "../hooks/useProfile";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const {
    profile: profileResponse,
    loading,
    error,
    refreshProfile,
  } = UserProfile();
  // Profile Settings - loaded from API
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    targetRole: "",
    experienceLevel: "intermediate",
    skills: [],
  });
  console.log("===================Profile Data===========", profileData);
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
  });

  // Appearance Settings
  const { theme, setTheme } = useTheme();
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    language: "en",
    compactMode: false,
  });

  // Sync theme with context
  useEffect(() => {
    setAppearanceSettings((prev) => ({ ...prev, theme }));
  }, [theme]);

  // Load profile data from UserProfile hook
  useEffect(() => {
    if (profileResponse?.success && profileResponse?.data) {
      const { user, profile: userProfile } = profileResponse.data;

      // Set profile data from API response
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        bio: userProfile?.bio || "",
        location: userProfile?.location || "",
        website: userProfile?.website || "",
        phone: userProfile?.phone || "",
        targetRole: userProfile?.targetRole || "",
        experienceLevel: userProfile?.experienceLevel || "intermediate",
        skills: userProfile?.skills || [],
      });

      // Set notification preferences from API
      if (userProfile?.notificationPreferences) {
        setNotificationSettings({
          emailNotifications:
            userProfile.notificationPreferences.emailNotifications ?? true,
          pushNotifications:
            userProfile.notificationPreferences.pushNotifications ?? false,
        });
      }

      // Set privacy settings from API
      if (userProfile?.privacySettings) {
        setPrivacySettings({
          profileVisibility:
            userProfile.privacySettings.profileVisibility || "public",
          showEmail: userProfile.privacySettings.showEmail ?? false,
          showPhone: userProfile.privacySettings.showPhone ?? false,
        });
      }
    }
  }, [profileResponse]);

  // Handle Profile Save - Uses updatePersonalInformation and updateProfile APIs
  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const currentProfile = profileResponse?.data;

      // Update personal info (name) if changed
      if (profileData.name && profileData.name !== currentProfile?.user?.name) {
        await updatePersonalInformation({ name: profileData.name });
      }

      // Update profile fields (bio, location, website, phone, targetRole, experienceLevel, skills)
      const profileUpdates = {};
      if (profileData.bio !== currentProfile?.profile?.bio)
        profileUpdates.bio = profileData.bio;
      if (profileData.location !== currentProfile?.profile?.location)
        profileUpdates.location = profileData.location;
      if (profileData.website !== currentProfile?.profile?.website)
        profileUpdates.website = profileData.website;
      if (profileData.phone !== currentProfile?.profile?.phone)
        profileUpdates.phone = profileData.phone;
      if (profileData.targetRole !== currentProfile?.profile?.targetRole)
        profileUpdates.targetRole = profileData.targetRole;
      if (
        profileData.experienceLevel !== currentProfile?.profile?.experienceLevel
      )
        profileUpdates.experienceLevel = profileData.experienceLevel;
      if (
        JSON.stringify(profileData.skills) !==
        JSON.stringify(currentProfile?.profile?.skills)
      )
        profileUpdates.skills = profileData.skills;

      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(profileUpdates);
      }

      // Refresh profile data to show updates
      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle Notification Settings Save - Uses updateSettings API
  const handleNotificationSave = async () => {
    try {
      setSaving(true);
      await updateSettings({
        notificationPreferences: notificationSettings,
      });
      // Refresh profile data to show updates
      await refreshProfile();
      toast.success("Notification settings saved!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to save notification settings",
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle Privacy Settings Save - Uses updateSettings API
  const handlePrivacySave = async () => {
    try {
      setSaving(true);
      await updateSettings({
        privacySettings: {
          profileVisibility: privacySettings.profileVisibility,
          showEmail: privacySettings.showEmail,
          showPhone: privacySettings.showPhone,
        },
      });
      // Refresh profile data to show updates
      await refreshProfile();
      toast.success("Privacy settings saved!");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to save privacy settings",
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle skills input change
  const handleSkillsChange = (e) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
    setProfileData({ ...profileData, skills: skillsArray });
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
        </div>
        <div className="text-center text-red-400 p-8">
          Failed to load settings. Please try again.
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
          <User className="w-4 h-4 inline-block mr-2" /> Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`settings-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
        >
          <Bell className="w-4 h-4 inline-block mr-2" /> Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`settings-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
        >
          <Lock className="w-4 h-4 inline-block mr-2" /> Privacy
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`settings-tab-btn ${activeTab === "appearance" ? "active" : ""}`}
        >
          <Palette className="w-4 h-4 inline-block mr-2" /> Appearance
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
                  minLength={2}
                />
                <span
                  className="settings-item-desc"
                  style={{ marginTop: "0.25rem", display: "block" }}
                >
                  Minimum 2 characters
                </span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="settings-input"
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
                <span
                  className="settings-item-desc"
                  style={{ marginTop: "0.25rem", display: "block" }}
                >
                  Email cannot be changed
                </span>
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
                  {profileData.bio.length}/500 characters
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
                  maxLength={100}
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

              <div className="settings-form-group">
                <label className="settings-label">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="settings-input"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Target Role</label>
                <input
                  type="text"
                  value={profileData.targetRole}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      targetRole: e.target.value,
                    })
                  }
                  className="settings-input"
                  placeholder="e.g. Senior Full-Stack Developer"
                  maxLength={100}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Experience Level</label>
                <select
                  value={profileData.experienceLevel}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      experienceLevel: e.target.value,
                    })
                  }
                  className="settings-select"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-label">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={profileData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  className="settings-input"
                  placeholder="React, Node.js, Python, etc."
                />
                <span
                  className="settings-item-desc"
                  style={{ marginTop: "0.25rem", display: "block" }}
                >
                  Separate skills with commas
                </span>
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
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    Public - Anyone can view
                  </option>
                  <option
                    value="private"
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    Private - Only you
                  </option>
                  <option
                    value="connections"
                    style={{ background: "#0f0c29", color: "#fff" }}
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
                  key: "showPhone",
                  label: "Show Phone Number",
                  desc: "Display your phone number on your profile",
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
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    Dark Mode
                  </option>
                  <option
                    value="light"
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    Light Mode
                  </option>
                  <option
                    value="auto"
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    Auto (System)
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
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    🇬🇧 English
                  </option>
                  <option
                    value="es"
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    🇪🇸 Español
                  </option>
                  <option
                    value="fr"
                    style={{ background: "#0f0c29", color: "#fff" }}
                  >
                    🇫🇷 Français
                  </option>
                  <option
                    value="de"
                    style={{ background: "#0f0c29", color: "#fff" }}
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
              onClick={() => toast.success("Appearance settings saved!")}
              disabled={saving}
              className="settings-btn"
            >
              Save Appearance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
