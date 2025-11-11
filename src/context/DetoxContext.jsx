// src/context/DetoxContext.jsx
import { createContext, useContext, useState } from "react";

const DetoxContext = createContext();

export const DetoxProvider = ({ children }) => {
  const [detoxDuration, setDetoxDuration] = useState(25);
  const [scrollToTimer, setScrollToTimer] = useState(false);
  const [shouldStartTimer, setShouldStartTimer] = useState(false); // ✅ NEW

  return (
    <DetoxContext.Provider
      value={{
        detoxDuration,
        setDetoxDuration,
        scrollToTimer,
        setScrollToTimer,
        shouldStartTimer,
        setShouldStartTimer,
      }}
    >
      {children}
    </DetoxContext.Provider>
  );
};

export const useDetox = () => useContext(DetoxContext);
