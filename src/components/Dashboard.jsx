import React, { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ScreenTimeCard from "./ScreenTimeCard.jsx";
import DetoxTimer from "./DetoxTimer.jsx";
import JournalCard from "./JournalCard.jsx";
import Chatbot from "./Chatbot.jsx";
import BadgesCard from "./BadgesCard.jsx";
import DetoxSessions from "./DetoxSessions.jsx"; // ✅ NEW: Import DetoxSessions
import { useAuth } from "../context/AuthContext";
import { useUserStreak } from "../hooks/useUserStreak.js";

const Dashboard = () => {
  const { user } = useAuth();
  const streak = useUserStreak(user?.uid);
  const [chatOpen, setChatOpen] = useState(false);

  // Mock stats for now (replace later with Firestore data)
  const userStats = {
    journalCount: 7,
    detoxCount: 10,
    streak: streak || 0,
    level: 3,
  };

  const handleJournalSave = () => {
    console.log("Journal entry saved — streak will auto-update via Firestore.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {/* 🌿 Fixed Header */}
      <Header setPage={() => {}} />

      {/* 🌿 Main Content */}
      <main className="flex-1 pt-24 pb-16 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Heading */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-brand-dark dark:text-brand-light mb-2 animate-fade-in">
                Welcome Back, {user?.displayName?.split(" ")[0] || "Friend"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 animate-slide-up-delay-1">
                Here’s your digital wellness summary and personal assistant.
              </p>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-700">
            {/* Screen Time */}
            <div className="opacity-0 animate-slide-up-delay-1">
              <ScreenTimeCard />
            </div>

            {/* Detox Timer */}
            <div className="opacity-0 animate-slide-up-delay-2">
              <DetoxTimer user={user} />
            </div>

            {/* Journal + Badges + DetoxSessions */}
            <div className="opacity-0 animate-slide-up-delay-3 lg:col-span-2 xl:col-span-3 space-y-8">
              <JournalCard onSave={handleJournalSave} />
              <BadgesCard userStats={userStats} />
              <DetoxSessions /> {/* ✅ Added Detox Sessions section */}
            </div>
          </div>
        </div>

        {/* 🌿 Floating Chat Button */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl hover:bg-emerald-600 transition-all duration-300 flex items-center gap-2"
          >
            💬 Oasis Bot
          </button>
        )}

        {/* 🌿 Sliding Chat Panel (RHS) */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-100 dark:border-gray-700 z-50 transform transition-transform duration-500 ease-in-out ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 bg-brand-primary text-white rounded-tl-3xl shadow-md">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🤖 Oasis Bot
            </h2>
            <button
              onClick={() => setChatOpen(false)}
              className="bg-white text-brand-dark rounded-full px-2 py-1 text-sm font-medium hover:bg-gray-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Chatbot Component */}
          <div className="h-[calc(100%-64px)] p-4 overflow-y-auto">
            <Chatbot />
          </div>
        </div>

        {/* Background Overlay when chat is open */}
        {chatOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setChatOpen(false)}
          ></div>
        )}
      </main>

      {/* 🌿 Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
