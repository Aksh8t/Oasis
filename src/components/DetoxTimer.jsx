import React, { useState, useEffect, useRef } from "react";
import { TimerIcon } from "./Icons.jsx";
import { useDetox } from "../context/DetoxContext";

const DetoxTimer = () => {
  const {
    detoxDuration,
    scrollToTimer,
    setScrollToTimer,
    shouldStartTimer,
    setShouldStartTimer,
  } = useDetox();

  const [secondsLeft, setSecondsLeft] = useState(detoxDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setSecondsLeft(detoxDuration * 60);
  }, [detoxDuration]);

  // ✅ Auto start the timer if DetoxSessions triggers it
  useEffect(() => {
    if (shouldStartTimer) {
      setIsRunning(true);
      setShouldStartTimer(false);
    }
  }, [shouldStartTimer, setShouldStartTimer]);

  // ✅ Smooth scroll when new session starts
  useEffect(() => {
    if (scrollToTimer && timerRef.current) {
      timerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2000);
      setScrollToTimer(false);
    }
  }, [scrollToTimer, setScrollToTimer]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (!isRunning && secondsLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const handleReset = () => {
    setSecondsLeft(detoxDuration * 60);
    setIsRunning(false);
  };

  return (
    <div
      ref={timerRef}
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all duration-500 ${
        highlight ? "ring-4 ring-green-400" : "hover:shadow-xl"
      }`}
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <TimerIcon /> Detox Timer
      </h3>

      <div className="text-center my-8">
        <span className="text-7xl font-extrabold text-brand-primary tabular-nums">
          {minutes}:{seconds}
        </span>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Session: {detoxDuration} min
        </p>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg w-full hover:bg-brand-dark transition-all"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg w-full hover:bg-amber-600 transition-all"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg w-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DetoxTimer;
