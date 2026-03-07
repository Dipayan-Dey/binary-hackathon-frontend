import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";
import {
  Home,
  Sparkles,
  Mic,
  FileText,
  MessageSquare,
  BarChart3,
  Link2,
  Settings,
  LogOut,
  Menu,
  Globe,
  MessageSquareText,
  Github,
  Users,
} from "lucide-react";
import "./Sidebar.css";
const devlogo = "/my-sig-logo.png";

const Sidebar = ({ profile }) => {
  const { logout } = useAuth();
  // console.log(profile);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d9ff",
      cancelButtonColor: "#ff006e",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");

        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          // confirmButtonColor: "#00d9ff",
          background: "#0f172a",
          color: "#ffffff",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {profile?.data?.user?.avatar ? (
              <img
                src={profile?.data?.user?.avatar}
                alt=""
                className="rounded-full"
              />
            ) : (
              <h1 className="text-5xl font-bold">
                {profile?.data?.user?.name.charAt(0).toUpperCase()}
              </h1>
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {profile?.data?.user?.name || "User"}
            </h3>
            {/* <p className="profile-email">
              {profile?.data?.user?.email || "user@example.com"}
            </p> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard/overview"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dashboard/resume-analyse"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Sparkles size={20} />
            <span>Resume Analyze</span>
          </NavLink>
          <NavLink
            to="/dashboard/quiz"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <FileText size={20} />
            <span>Skill Quiz</span>
          </NavLink>
          <NavLink
            to="/dashboard/interview"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Mic size={20} />
            <span>Mock Interview</span>
          </NavLink>

          {/* <NavLink
            to="/dashboard/team"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Users size={20} />
            <span>Team</span>
          </NavLink> */}

          <NavLink
            to="/dashboard/career-map"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Globe size={20} />
            <span>Career Map</span>
          </NavLink>

          <NavLink
            to="/dashboard/chatbot"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <MessageSquareText size={20} />
            <span>Chatbot</span>
          </NavLink>

          <div className="nav-divider"></div>

          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Github size={20} />
            <span>Github Reports</span>
          </NavLink>

          <NavLink
            to="/dashboard/integrations"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Link2 size={20} />
            <span>Social Integrations</span>
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <p className="text-[15px] text-gray-400 mt-4 text-center hover:text-gray-200">
            <a
              href="https://www.dipayandey.site"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Developer's Profile
            </a>
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
