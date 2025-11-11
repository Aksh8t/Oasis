import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const ScreenTimeTracker = () => {
  const { user } = useAuth();
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastActiveRef = useRef(Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const ref = doc(db, "users", user.uid, "analytics", "screenTime");
        const snap = await getDoc(ref);
        const today = new Date();

        if (snap.exists()) {
          const data = snap.data();
          const lastUpdated = data.lastUpdated?.toDate();
          const sameDay =
            lastUpdated &&
            lastUpdated.getDate() === today.getDate() &&
            lastUpdated.getMonth() === today.getMonth() &&
            lastUpdated.getFullYear() === today.getFullYear();

          if (sameDay) {
            setActiveMinutes(data.activeMinutes || 0);
          } else {
            await setDoc(ref, { activeMinutes: 0, lastUpdated: serverTimestamp() });
            setActiveMinutes(0);
          }
        } else {
          await setDoc(ref, { activeMinutes: 0, lastUpdated: serverTimestamp() });
          setActiveMinutes(0);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!user || loading) return;

    const ref = doc(db, "users", user.uid, "analytics", "screenTime");

    const startTracking = () => {
      if (!intervalRef.current) {
        lastActiveRef.current = Date.now();
        intervalRef.current = setInterval(async () => {
          const elapsedMinutes = Math.floor((Date.now() - lastActiveRef.current) / 60000);
          if (elapsedMinutes >= 1) {
            setActiveMinutes((prev) => prev + elapsedMinutes);
            lastActiveRef.current = Date.now();

            try {
              await updateDoc(ref, {
                activeMinutes: activeMinutes + elapsedMinutes,
                lastUpdated: serverTimestamp(),
              });
            } catch (err) {
              console.error("Error updating screen time:", err);
            }
          }
        }, 60000);
      }
    };

    const stopTracking = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopTracking();
      else startTracking();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTracking();

    return () => {
      stopTracking();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, loading, activeMinutes]);

  const hours = Math.floor(activeMinutes / 60);
  const minutes = activeMinutes % 60;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Your Focus Time (Today)
      </h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <p className="text-3xl font-extrabold text-brand-dark dark:text-brand-primary">
          {hours}h {minutes}m
        </p>
      )}
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
        (Tracks real time when tab is open and active)
      </p>
    </div>
  );
};

export default ScreenTimeTracker;
