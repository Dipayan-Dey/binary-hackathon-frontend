import React from "react";
// import { useAuth } from "../../context/authContext";
import "./DashboardPages.css";

const Overview = ({profile}) => {
  // const { userData } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          Welcome back, {profile?.data?.user?.name?.split(" ")[0] || "User"}! Here's your
          profile summary.
        </p>
      </div>

      <div className="cards-grid">
        {/* User Profile Card */}
        <div className="info-card">
          <div className="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <div>
            <h3 className="card-title">Full Name</h3>
          <p className="card-value">{profile?.data?.user?.name || "Loading..."}</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="info-card">
          <div className="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <div>
            <h3 className="card-title">Email Address</h3>
          <p className="card-value email-text">
            {profile?.data?.user?.email || "Loading..."}
          </p>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="info-card">
          <div className="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="card-title">Account Status</h3>
          <p className="card-value status-active">
            <span className="status-dot"></span>
            Active
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
