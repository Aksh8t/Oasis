import { db } from "../firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

export const updateXP = async (uid, amount) => {
  const ref = doc(db, "users", uid, "stats", "progress");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const newXP = (data.xp || 0) + amount;
  let newLevel = data.level || 1;

  if (newXP >= 100) {
    newLevel += 1;
    await updateDoc(ref, { xp: newXP - 100, level: newLevel });
  } else {
    await updateDoc(ref, { xp: newXP });
  }
};
