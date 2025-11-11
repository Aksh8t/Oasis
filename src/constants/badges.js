// src/constants/badges.js
import { Flame, PenTool, Target, ShieldCheck, Brain, Leaf } from "lucide-react";

export const badges = [
  {
    id: "mind_opener",
    name: "Mind Opener",
    icon: PenTool,
    description: "Wrote your first journal entry — the start of mindfulness.",
    condition: (stats) => stats.journalCount >= 1,
  },
  {
    id: "reflective_soul",
    name: "Reflective Soul",
    icon: Brain,
    description: "Wrote 5 journal entries — growing awareness.",
    condition: (stats) => stats.journalCount >= 5,
  },
  {
    id: "focus_spark",
    name: "Focus Spark",
    icon: Flame,
    description: "Completed your first digital detox timer.",
    condition: (stats) => stats.detoxSessions >= 1,
  },
  {
    id: "discipline_master",
    name: "Discipline Master",
    icon: ShieldCheck,
    description: "Completed 10 successful detox sessions.",
    condition: (stats) => stats.detoxSessions >= 10,
  },
  {
    id: "green_mind",
    name: "Green Mind",
    icon: Leaf,
    description: "Stayed consistent for 7 days straight.",
    condition: (stats) => stats.streak >= 7,
  },
];
