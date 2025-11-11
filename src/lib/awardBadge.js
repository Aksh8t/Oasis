import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Awards a badge to the user if not already earned.
 * @param {string} userId - Firebase UID of user
 * @param {string} badgeId - Badge identifier
 * @param {object} badgeData - Badge details (name, description, icon, etc.)
 */
export const awardBadge = async (userId, badgeId, badgeData) => {
  if (!userId || !badgeId) return;

  try {
    const badgeRef = doc(db, "users", userId, "badges", badgeId);
    const badgeSnap = await getDoc(badgeRef);

    if (!badgeSnap.exists()) {
      await setDoc(badgeRef, {
        ...badgeData,
        earnedAt: new Date(),
      });
      console.log(`🏅 Badge unlocked: ${badgeData.name}`);
    }
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};
