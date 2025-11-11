import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { updateLoginStreak } from "../lib/updateLoginStreak.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser) {
      console.log("👤 Logged in user:", currentUser.email, "UID:", currentUser.uid);

      try {
        // ✅ Update login streak (creates Firestore document)
        await updateLoginStreak(currentUser.uid);
        console.log("🔥 Login streak updated successfully");
      } catch (err) {
        console.error("❌ Error updating login streak:", err);
      }
    } else {
      console.log("🚪 User logged out or not authenticated");
    }
  });

  return unsubscribe;
}, []);


  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
