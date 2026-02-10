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
import Overview from "./pages/dashboard/Overview";
import AIAnalyze from "./pages/dashboard/AIAnalyze";
import Chatbot from "./pages/dashboard/Chatbot";
import Settings from "./pages/dashboard/Settings";
import Analytics from "./pages/dashboard/Analytics";
import Projects from "./pages/dashboard/Projects";
import Team from "./pages/dashboard/Team";
import Calendar from "./pages/dashboard/Calendar";
import Reports from "./pages/dashboard/Reports";
import Integrations from "./pages/dashboard/Integrations";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authContext";
// import { PublicRoute, PrivateRoute } from "./components/protectedroute/ProtectedRoute";
import UserProfile from "./hooks/UserProfile";
import { PrivateRoute, PublicRoute } from "./components/protectedroute/ProtectedRoute";
function AppContent() {
  const { profile } = UserProfile();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
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
            <Route path="overview" element={<Overview profile={profile} />} />
            <Route path="ai-analyze" element={<AIAnalyze />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="projects" element={<Projects />} />
            <Route path="team" element={<Team />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
