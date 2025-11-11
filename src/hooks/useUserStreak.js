// src/hooks/useUserStreak.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const useUserStreak = (userId) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const ref = doc(db, "users", userId, "progress", "streak");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.currentStreak || 0);
      } else {
        setStreak(0);
      }
    });

    return () => unsub();
  }, [userId]);

  return streak;
};
