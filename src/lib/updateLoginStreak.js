import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateLoginStreak = async (userId) => {
  if (!userId) return;

  const ref = doc(db, "users", userId, "progress", "streak");
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  try {
    const snap = await getDoc(ref);

    let currentStreak = 1;
    if (snap.exists()) {
      const data = snap.data();
      const lastLogin = data.lastLoginDate ? new Date(data.lastLoginDate) : null;

      if (lastLogin) {
        const diffDays = (now - lastLogin) / (1000 * 60 * 60 * 24);

        if (diffDays < 1) {
          currentStreak = data.currentStreak || 1;
        } else if (diffDays < 2) {
          currentStreak = (data.currentStreak || 0) + 1;
        } else {
          currentStreak = 1;
        }
      }
    }

    await setDoc(ref, {
      currentStreak,
      lastLoginDate: today,
    });

    console.log("🔥 Streak updated:", currentStreak);
  } catch (err) {
    console.error("❌ Firestore write failed:", err);
  }
};
