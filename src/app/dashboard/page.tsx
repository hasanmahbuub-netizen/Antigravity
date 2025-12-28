"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ZoneA_Quran from "@/components/dashboard/ZoneA_Quran";
import ZoneB_Fiqh from "@/components/dashboard/ZoneB_Fiqh";
import AmbientOrb from "@/components/AmbientOrb";
import { getSpiritualNudge, type SpiritualNudge } from "@/lib/agents/dua-agent";
import { getNextPrayer, getCurrentPrayer, formatTimeUntil, type PrayerReminder, type CurrentPrayerInfo } from "@/lib/agents/namaz-agent";
import { startNotificationScheduler, stopNotificationScheduler } from "@/lib/notificationScheduler";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [showNudges, setShowNudges] = useState(false);
  const [greeting, setGreeting] = useState("Assalamu Alaikum");
  const [nudge, setNudge] = useState<SpiritualNudge | null>(null);
  const [prayerReminder, setPrayerReminder] = useState<PrayerReminder | null>(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState<CurrentPrayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Time-based greeting and fetch agents data
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Start notification scheduler with user ID
    async function initNotifications() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && 'Notification' in window && Notification.permission === 'granted') {
          await startNotificationScheduler(user.id);
        }
      } catch (e) {
        console.warn('Notification scheduler init skipped:', e);
      }
    }
    initNotifications();

    // Fetch spiritual context and check profile
    async function loadContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check onboarding status
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

          if (!profile || !profile.onboarding_completed) {
            console.log("🚦 Onboarding not completed. Redirecting...");
            router.push('/onboarding');
            return;
          }
        }

        const spiritualNudge = getSpiritualNudge();
        setNudge(spiritualNudge);

        const nextPrayer = await getNextPrayer();
        setPrayerReminder(nextPrayer);

        const prayerInfo = await getCurrentPrayer();
        setCurrentPrayerInfo(prayerInfo);
      } catch (error) {
        console.error("Failed to load dashboard context:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContext();

    // Refresh every minute for real-time updates
    const interval = setInterval(loadContext, 60 * 1000);
    return () => {
      clearInterval(interval);
      stopNotificationScheduler();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] gap-4 overflow-hidden">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between shrink-0 pt-1">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{greeting}</h1>
          {currentPrayerInfo && !loading ? (
            <div className="flex items-center gap-2 mt-1">
              {/* Current Prayer - Primary Display */}
              {currentPrayerInfo.current ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">
                    {currentPrayerInfo.current.name}
                  </span>
                  <span className="text-xs text-muted">
                    • {formatTimeUntil(currentPrayerInfo.current.minutesRemaining)} left
                  </span>
                </div>
              ) : currentPrayerInfo.next && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted" />
                  <span className="text-xs text-muted">
                    {currentPrayerInfo.next.name} in {formatTimeUntil(currentPrayerInfo.next.minutesUntil)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted">Continue your journey</p>
          )}
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
              {(nudge || prayerReminder) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Nudges Dropdown - Real Data */}
            <AnimatePresence>
              {showNudges && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="fixed left-4 right-4 top-16 max-w-sm mx-auto bg-card border border-border rounded-2xl shadow-xl shadow-black/20 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-muted uppercase tracking-wider">Spiritual Nudges</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-2">
                    {/* Prayer Reminder */}
                    {prayerReminder && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{prayerReminder.icon}</span>
                          <span className="text-xs font-medium text-primary">{prayerReminder.prayer.name}</span>
                          <span className="text-[10px] text-muted ml-auto">
                            {prayerReminder.status === 'now' ? 'Now' : formatTimeUntil(prayerReminder.minutesUntil)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{prayerReminder.message}</p>
                      </div>
                    )}

                    {/* Dua Nudge */}
                    {nudge && (
                      <div className="p-3 rounded-xl hover:bg-muted/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{nudge.icon}</span>
                          <span className="text-xs text-muted">{nudge.timing}</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{nudge.message}</p>
                      </div>
                    )}
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

          {/* Profile */}
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <User className="w-4 h-4 text-primary" />
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

      {/* Ambient Orb - Spiritual Presence */}
      <AmbientOrb />
    </div>
  );
}
