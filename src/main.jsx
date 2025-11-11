import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ✅ This line imports Tailwind
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { DetoxProvider } from "./context/DetoxContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <DetoxProvider>
        <App />
      </DetoxProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);