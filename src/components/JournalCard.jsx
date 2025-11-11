// src/components/JournalCard.jsx
import React, { useState, useEffect } from "react";
import { BookOpenIcon, CheckCircleIcon } from "./Icons.jsx";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { updateProgress } from "../lib/updateProgress.js";
import { awardBadge } from "../lib/awardBadge.js";
import { badges } from "../constants/badges.js";

const JournalCard = ({ onSave = () => {} }) => {
  const { user } = useAuth();
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [viewEntries, setViewEntries] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const blastConfetti = () => {
    const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#34D399", "#FB7185", "#F59E0B"];
    const pieces = 70;
    const duration = 900;
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.top = "50%";
      el.style.width = "6px";
      el.style.height = "10px";
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.transform = "translate(-50%, -50%)";
      el.style.opacity = "1";
      el.style.pointerEvents = "none";
      el.style.zIndex = "9999";
      el.style.borderRadius = "2px";
      el.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease-out`;
      document.body.appendChild(el);
      const angle = Math.random() * 2 * Math.PI;
      const distance = 100 + Math.random() * 150;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const rotate = Math.floor(Math.random() * 1000);
      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
        el.style.opacity = "0";
      });
      setTimeout(() => el.remove(), duration + 200);
    }
  };

  // fetch all entries for user
  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const journalRef = collection(db, "users", user.uid, "journalEntries");
      const q = query(journalRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEntries(docs);
    } catch (e) {
      console.error("Error fetching journal entries:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ✅ Modified only this function — added real progress + badge logic
  const handleSaveEntry = async () => {
    if (!entry.trim()) return setMessage("Please write something first!");
    if (!user) return setMessage("Please sign in to save entries.");

    const tempId = `temp-${Date.now()}`;
    const newEntry = {
      id: tempId,
      text: entry.trim(),
      createdAt: new Date(),
      isSaving: true,
    };

    // optimistic UI update
    setEntries((prev) => [newEntry, ...prev]);
    setEntry("");
    onSave();
    blastConfetti();
    setMessage("Saving...");

    try {
      const ref = collection(db, "users", user.uid, "journalEntries");
      const docRef = await addDoc(ref, {
        text: newEntry.text,
        createdAt: serverTimestamp(),
      });

      // ✅ update user progress dynamically
      const updatedStats = await updateProgress(user.uid, { journalCount: 1 });

      // ✅ check and award badges dynamically
      if (updatedStats) {
        for (const b of badges) {
          if (b.condition(updatedStats)) {
            await awardBadge(user.uid, b.id, b);
          }
        }
      }

      // replace temp entry with real one
      setEntries((prev) =>
        prev.map((e) =>
          e.id === tempId ? { id: docRef.id, text: newEntry.text, createdAt: new Date() } : e
        )
      );

      setMessage("Entry saved!");
    } catch (error) {
      console.error("Save failed:", error);
      setEntries((prev) => prev.filter((e) => e.id !== tempId));
      setMessage("Error saving entry.");
    }

    setTimeout(() => setMessage(""), 1800);
  };

  // ✅ Everything below is unchanged (edit, delete, view, etc.)
  const startEditing = (entryObj) => {
    setEditingEntry(entryObj.id);
    setEditText(entryObj.text || "");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return setMessage("Entry cannot be empty.");

    const original = entries.find((e) => e.id === id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, text: editText } : e)));
    setEditingEntry(null);
    setEditText("");
    setMessage("Updating...");

    try {
      const entryRef = doc(db, "users", user.uid, "journalEntries", id);
      await updateDoc(entryRef, { text: editText });
      setMessage("Entry updated!");
    } catch (error) {
      console.error("Update failed:", error);
      setEntries((prev) => prev.map((e) => (e.id === id ? original : e)));
      setMessage("Error updating entry.");
    }

    setTimeout(() => setMessage(""), 1600);
  };

  const handleDelete = async (id) => {
    const original = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setMessage("Deleting...");

    try {
      await deleteDoc(doc(db, "users", user.uid, "journalEntries", id));
      setMessage("Entry deleted!");
    } catch (error) {
      console.error("Delete failed:", error);
      setEntries(original);
      setMessage("Error deleting entry.");
    }

    setTimeout(() => setMessage(""), 1600);
  };

  const formatCreatedAt = (c) => {
    try {
      if (!c) return "Just now";
      if (c.toDate) return c.toDate().toLocaleString();
      if (c instanceof Date) return c.toLocaleString();
      return new Date(c).toLocaleString();
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-4 flex items-center gap-2">
        <BookOpenIcon /> Daily Journal
      </h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        What's on your mind today? Write and reflect.
      </p>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800 dark:text-gray-100"
        placeholder="Today I felt..."
      />

      <div className="flex justify-between items-center mt-4">
        <div className="h-5">
          {message && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 animate-fade-in">
              <CheckCircleIcon /> {message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveEntry}
            disabled={!entry.trim() || !user}
            className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark transition duration-300 disabled:opacity-50"
          >
            Save Entry
          </button>
          <button
            onClick={() => setViewEntries((v) => !v)}
            className="text-sm text-gray-500 dark:text-gray-300 hover:underline"
          >
            {viewEntries ? "Hide Entries" : "View My Entries"}
          </button>
        </div>
      </div>

      {viewEntries && (
        <div className="mt-4 max-h-72 overflow-y-auto space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No entries yet.
            </p>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {editingEntry === e.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(ev) => setEditText(ev.target.value)}
                      className="w-full p-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:bg-gray-600 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(e.id)}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-200 text-sm mb-1 whitespace-pre-line">{e.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right mb-2">
                      {formatCreatedAt(e.createdAt)}
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => startEditing(e)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JournalCard;
