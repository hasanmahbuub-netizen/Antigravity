import ZoneA_Quran from "@/components/dashboard/ZoneA_Quran";
import ZoneB_Fiqh from "@/components/dashboard/ZoneB_Fiqh";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <ZoneA_Quran />
      <ZoneB_Fiqh />
    </div>
  );
}
