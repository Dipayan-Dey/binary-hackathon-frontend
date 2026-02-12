import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/sidebar/Sidebar";
import "./DashboardLayout.css";
import UserProfile from "../hooks/UserProfile";

const DashboardLayout = () => {
    const { profile } = UserProfile();
  return (
    <div className="dashboard-layout">
      <Sidebar profile={profile} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
