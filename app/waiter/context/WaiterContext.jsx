"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const WaiterContext = createContext(null);

export function WaiterProvider({ children }) {
  const [selectedWaiter, setSelectedWaiter] =
    useState(null);

  const value = {
    selectedWaiter,
    setSelectedWaiter,
  };

  return (
    <WaiterContext.Provider value={value}>
      {children}
    </WaiterContext.Provider>
  );
}

export function useWaiter() {
  const context = useContext(WaiterContext);

  if (!context) {
    throw new Error(
      "useWaiter must be used inside a WaiterProvider"
    );
  }

  return context;
}