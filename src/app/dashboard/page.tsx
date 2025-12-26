"use client";

import { useState, useEffect } from "react";
import { Bell, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ZoneA_Quran from "@/components/dashboard/ZoneA_Quran";
import ZoneB_Fiqh from "@/components/dashboard/ZoneB_Fiqh";

// Sample spiritual nudges - these would come from AI agents in full implementation
const SPIRITUAL_NUDGES = [
  { id: 1, message: "Asr is approaching. Your prayer mat awaits. 🕌", type: "prayer", time: "5 mins" },
  { id: 2, message: "End your day with one verse. Let your heart rest. 📖", type: "quran", time: "11 PM" },
];

export default function Dashboard() {
  const [showNudges, setShowNudges] = useState(false);
  const [greeting, setGreeting] = useState("Assalamu Alaikum");

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] gap-4">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between shrink-0 -mt-2 -mx-1">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{greeting}</h1>
          <p className="text-xs text-muted">Let's continue your journey</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNudges(!showNudges)}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/30 transition-colors relative"
            >
              <Bell className="w-4 h-4 text-muted" />
              {/* Notification dot */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Nudges Dropdown */}
            <AnimatePresence>
              {showNudges && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-muted uppercase tracking-wider">Spiritual Nudges</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {SPIRITUAL_NUDGES.map((nudge) => (
                      <div
                        key={nudge.id}
                        className="p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <p className="text-sm text-foreground leading-relaxed">{nudge.message}</p>
                        <p className="text-[10px] text-muted mt-1">{nudge.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <Link href="/settings" className="text-xs text-primary hover:underline">
                      Customize notifications →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/30 transition-colors"
          >
            <Settings className="w-4 h-4 text-muted" />
          </Link>
        </div>
      </header>

      {/* Zone A: Quran Practice (60%) */}
      <div className="flex-[3] min-h-0">
        <ZoneA_Quran />
      </div>

      {/* Zone B: Fiqh Q&A (40%) */}
      <div className="flex-[2] min-h-0">
        <ZoneB_Fiqh />
      </div>
    </div>
  );
}
