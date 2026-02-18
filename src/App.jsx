import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./dashboard/Overview";
import AIAnalyze from "./dashboard/AIAnalyze";
import Chatbot from "./dashboard/Chatbot";
import Settings from "./dashboard/Settings";
import Analytics from "./dashboard/Analytics";
import Projects from "./dashboard/Projects";
import Team from "./dashboard/Team";
import Calendar from "./dashboard/Calendar";
import Reports from "./dashboard/Reports";
import Integrations from "./dashboard/Integrations";
import Interview from "./dashboard/Interview";
import Quiz from "./dashboard/Quiz";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authContext";
// import { PublicRoute, PrivateRoute } from "./components/protectedroute/ProtectedRoute";
import UserProfile from "./hooks/UserProfile";
import {
  PrivateRoute,
  PublicRoute,
} from "./components/protectedroute/ProtectedRoute";

function AppContent() {
  const { profile } = UserProfile();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isDashboard = location.pathname.startsWith("/dashboard");
  const handleRefresh = () => {
    if (isDashboard) {
      profile.refetch();
    } else {
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAuthPage && !isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route
              path="overview"
              element={
                <Overview profile={profile} handleRefresh={handleRefresh} />
              }
            />
            <Route path="resume-analyse" element={<AIAnalyze />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="projects" element={<Projects />} />
            <Route path="team" element={<Team />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="interview" element={<Interview />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="live-interview" element={<LiveInterview />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
}

import { ThemeProvider } from "./context/ThemeContext";
import LiveInterview from "./dashboard/LiveInterview";
// import { UserAccout } from "./hooks/account";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
