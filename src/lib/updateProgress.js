import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { badges } from "../constants/badges";

export const updateProgress = async (uid, updates) => {
  if (!uid) return;

  const progressRef = doc(db, "users", uid, "progress", "stats");
  const badgesRef = (id) => doc(db, "users", uid, "badges", id);

  try {
    const snap = await getDoc(progressRef);
    let progress = snap.exists() ? snap.data() : { journalCount: 0, detoxSessions: 0, streak: 0 };

    // ✅ merge updates
    progress = {
      ...progress,
      ...Object.keys(updates).reduce((acc, key) => {
        acc[key] = (progress[key] || 0) + updates[key];
        return acc;
      }, {}),
    };

    await setDoc(progressRef, progress);

    // 🏅 Check for new badges
    for (const badge of badges) {
      if (badge.condition(progress)) {
        await setDoc(badgesRef(badge.id), { earnedAt: new Date() });
      }
    }

    return progress;
  } catch (err) {
    console.error("Error updating progress:", err);
  }
};
