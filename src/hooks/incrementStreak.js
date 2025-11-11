import { db } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { updateProgress } from "../lib/updateProgress.js";

/**
 * Increments the user’s daily login streak.
 * @param {string} userId - Firebase UID of the user.
 */
export const incrementStreak = async (userId) => {
  if (!userId) {
    console.error("incrementStreak: userId is missing");
    return { newStreak: 0 };
  }

  try {
    const streakRef = doc(db, "users", userId, "progress", "streakData");
    const streakSnap = await getDoc(streakRef);

    let newStreak = 1;
    const today = new Date().toDateString();

    if (streakSnap.exists()) {
      const data = streakSnap.data();
      const lastLogin = data.lastLogin?.toDate
        ? data.lastLogin.toDate().toDateString()
        : data.lastLogin;

      if (lastLogin === today) {
        // Already logged in today
        newStreak = data.currentStreak;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLogin === yesterday.toDateString()) {
          newStreak = (data.currentStreak || 0) + 1;
        } else {
          newStreak = 1; // streak reset
        }
      }
    }

    await setDoc(streakRef, {
      currentStreak: newStreak,
      lastLogin: serverTimestamp(),
    });

    // ✅ Also update streak count in progress collection
    await updateProgress(userId, { streak: 1 });

    return { newStreak };
  } catch (error) {
    console.error("Error updating login streak:", error);
    return { newStreak: 0 };
  }
};
