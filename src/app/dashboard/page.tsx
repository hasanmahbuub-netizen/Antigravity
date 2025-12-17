"use client";

import ZoneA_Quran from "@/components/dashboard/ZoneA_Quran";
import ZoneB_Fiqh from "@/components/dashboard/ZoneB_Fiqh";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
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
