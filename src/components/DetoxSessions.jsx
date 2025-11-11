import React, { useEffect, useState } from "react";
import { TimerIcon, TrashIcon } from "./Icons.jsx";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useDetox } from "../context/DetoxContext"; // ✅ add this
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { updateProgress } from "../lib/updateProgress.js";

const DetoxSessions = () => {
    const { user } = useAuth();
    const [sessionType, setSessionType] = useState("Focus");
const { setDetoxDuration, setScrollToTimer, setShouldStartTimer } = useDetox(); // ✅ include new one
    const [duration, setDuration] = useState(25);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        if (!user) return;
        const fetchSessions = async () => {
            const q = query(collection(db, "users", user.uid, "detoxSessions"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setSessions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        };
        fetchSessions();
    }, [user]);

    const handleStartSession = async () => {
        if (!user) return alert("Please log in first.");
        const newSession = {
            type: sessionType,
            duration,
            createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "users", user.uid, "detoxSessions"), newSession);
        await updateProgress(user.uid, { detoxSessions: 1 });

        // ✅ Update DetoxTimer time, auto-start, and scroll
        setDetoxDuration(duration);
        setScrollToTimer(true);
        setShouldStartTimer(true);

        alert(`✅ ${sessionType} session set for ${duration} minutes! Timer started.`);
    };




    const handleDeleteSession = async (id) => {
        await deleteDoc(doc(db, "users", user.uid, "detoxSessions", id));
        setSessions((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                <TimerIcon /> Detox Sessions
            </h3>

            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Type</label>
                    <select
                        value={sessionType}
                        onChange={(e) => setSessionType(e.target.value)}
                        className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                    >
                        <option>Focus</option>
                        <option>Study</option>
                        <option>Meditation</option>
                        <option>Workout</option>
                        <option>Custom</option>
                    </select>
                </div>

                <div className="flex-1 mt-3 md:mt-0">
                    <label className="block text-sm font-semibold mb-1">Duration (min)</label>
                    <input
                        type="number"
                        min="5"
                        max="180"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                    />
                </div>

                <button
                    onClick={handleStartSession}
                    className="mt-3 md:mt-6 md:self-end w-full md:w-auto px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-all text-sm"
                >
                    + Start
                </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-3" />

            <h4 className="text-md font-bold mb-2">Recent Sessions</h4>
            {sessions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No detox sessions yet.</p>
            ) : (
                <ul className="space-y-2">
                    {sessions.map((s) => (
                        <li
                            key={s.id}
                            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-sm"
                        >
                            <div>
                                <p className="font-semibold">{s.type}</p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {s.duration} min • {new Date(s.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteSession(s.id)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Delete session"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DetoxSessions;
