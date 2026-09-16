"use client";

import { WaiterProvider } from "./context/WaiterContext";
import WaiterInterface from "./WaiterInterface";

export default function WaiterPage() {
  return (
    <WaiterProvider>
      <WaiterInterface />
    </WaiterProvider>
  );
}