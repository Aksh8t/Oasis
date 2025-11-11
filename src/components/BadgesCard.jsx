import React from "react";
import { badges } from "../constants/badges";

const BadgesCard = ({ earned = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mt-10 transition-all duration-500">
      <h2 className="text-2xl font-bold mb-6">🏆 Your Achievements</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b) => {
          const Icon = b.icon; // ✅ store the component itself
          const unlocked = earned.includes(b.id);

          return (
            <div
              key={b.id}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                unlocked
                  ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-700 opacity-60"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* ✅ render icon properly */}
                <Icon
                  size={40}
                  className={`${
                    unlocked ? "text-green-500" : "text-gray-500"
                  }`}
                />
                <h4 className="font-semibold text-lg">{b.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {b.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesCard;
