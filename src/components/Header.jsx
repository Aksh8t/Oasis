// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LeafIcon, FlameIcon } from "./Icons.jsx";
import { useAuth } from "../context/AuthContext";
import { useUserStreak } from "../hooks/useUserStreak.js";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const streak = useUserStreak(user?.uid);
  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 animate-fade-in transition-all duration-300">
      <nav className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-2xl font-bold text-brand-dark dark:text-brand-light"
        >
          <LeafIcon />
          <span>Oasis</span>
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/about")}
            className="text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            About
          </button>
          <button
            onClick={() => navigate("/account")}
            className="text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Account
          </button>
        </div>

        {/* Theme Toggle & Auth */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm text-sm font-medium">
                <FlameIcon />
                <span>
                  {streak || 0} Day{streak !== 1 ? "s" : ""}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
