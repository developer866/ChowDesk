"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ Service worker registered", reg.scope))
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  return null; // renders nothing — just registers the SW
}