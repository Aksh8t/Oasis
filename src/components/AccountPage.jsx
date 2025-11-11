// src/pages/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { badges } from "../constants/badges";
import { Flame, PenTool, Timer, Brain } from "lucide-react";

const AccountPage = () => {
  const { user } = useAuth();
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    journalCount: 0,
    detoxSessions: 0,
    streak: 0,
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // 🪶 Count journal entries
        const journalsRef = collection(db, "users", user.uid, "journalEntries");
        const journalSnap = await getDocs(journalsRef);
        const journalCount = journalSnap.size;

        // 🧘 Count detox sessions
        const detoxRef = collection(db, "users", user.uid, "detoxSessions");
        const detoxSnap = await getDocs(detoxRef);
        const detoxSessions = detoxSnap.size;

        // 🔥 Fetch streak data
        const streakRef = doc(db, "users", user.uid, "progress", "streak");
        const streakSnap = await getDoc(streakRef);
        const streak = streakSnap.exists()
          ? streakSnap.data().currentStreak || 0
          : 0;

        // 🏅 Fetch earned badges
        const badgesRef = collection(db, "users", user.uid, "badges");
        const badgeSnap = await getDocs(badgesRef);
        setEarned(badgeSnap.docs.map((doc) => doc.id));

        // ✅ Update local state
        setProgress({ journalCount, detoxSessions, streak });
      } catch (err) {
        console.error("Error loading account data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
        <p>Loading your data...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all duration-500">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">👤 My Account</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your mindfulness journey and milestones.
            </p>
          </div>

          <div className="bg-brand-primary text-white px-5 py-2 rounded-full shadow-md text-sm font-semibold">
            {user?.email || "Guest"}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<PenTool className="w-8 h-8 text-brand-primary mb-2" />}
            value={progress.journalCount}
            label="Journal Entries"
          />
          <StatCard
            icon={<Timer className="w-8 h-8 text-brand-primary mb-2" />}
            value={progress.detoxSessions}
            label="Detox Sessions"
          />
          <StatCard
            icon={<Brain className="w-8 h-8 text-brand-primary mb-2" />}
            value={progress.streak}
            label="Streak Days"
          />
          <StatCard
            icon={<Flame className="w-8 h-8 text-brand-primary mb-2" />}
            value={earned.length}
            label="Badges Earned"
          />
        </div>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">🏅 Your Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {badges.map((b) => {
              const Icon = b.icon;
              const unlocked = earned.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl text-center border-2 transition-all duration-300 ${
                    unlocked
                      ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-700 opacity-60"
                  }`}
                >
                  <Icon
                    className={`mx-auto mb-3 w-10 h-10 ${
                      unlocked ? "text-green-500" : "text-gray-500"
                    }`}
                  />
                  <h4 className="font-semibold">{b.name}</h4>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center">
    {icon}
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default AccountPage;
