import type { Metadata, Viewport } from "next";
import { Inter, Noto_Naskh_Arabic, Amiri } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

const amiri = Amiri({
  weight: ["400", "700"],
  variable: "--font-amiri",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "IMANOS",
  description: "A quiet companion for daily Quran and practical guidance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F5F2' },
    { media: '(prefers-color-scheme: dark)', color: '#1F1C19' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={cn(
          inter.variable,
          notoNaskhArabic.variable,
          amiri.variable,
          "antialiased bg-background min-h-screen font-sans text-foreground"
        )}
      >
        {/* Global App Shell */}
        <div className="max-w-[430px] mx-auto min-h-screen bg-background px-5 pt-6 pb-8 flex flex-col relative shadow-xl shadow-black/5">
          {children}
        </div>
      </body>
    </html>
  );
}
