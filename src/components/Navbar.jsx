import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
// import UserProfile from "../hooks/UserProfile";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { profile } = UserProfile();
  // console.log(profile);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { name: "How It Works", path: "#workflow" },
    { name: "Features", path: "#features" },
    { name: "Benefits", path: "#benefits" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-blue-900/20 border border-slate-700/50"
          : "bg-white/10 backdrop-blur-md border border-white/20"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={`font-medium transition-colors relative group ${
                isScrolled
                  ? "text-slate-300 hover:text-white"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-yellow-300"
                }`}
              />
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/dashboard"
              className={`font-medium transition-colors ${
                isScrolled
                  ? "text-slate-300 hover:text-white"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                Dashboard
              </button>
            </Link>
            {/* <button
             
              onClick={logout}
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 group ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/50' 
                  : 'bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-700 hover:shadow-lg'
              }`}
            >
              Logout
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className={`font-medium transition-colors ${
                isScrolled
                  ? "text-slate-300 hover:text-white"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 group ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/50"
                  : "bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-700 hover:shadow-lg"
              }`}
            >
              Sign Up
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden transition-colors cursor-pointer ${
            isScrolled ? "text-slate-300 hover:text-white" : "text-white"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 overflow-hidden rounded-b-2xl"
          >
            <div className="px-4 py-4 flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-slate-300 hover:text-white font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-slate-700" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  {/* <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {profile?.data?.user?.name}
                  </Link> */}
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors ${
                      isScrolled
                        ? "text-slate-300 hover:text-white"
                        : "text-white hover:text-yellow-300"
                    }`}
                  >
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer w-full">
                      Dashboard
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium text-center hover:from-blue-700 hover:to-purple-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
