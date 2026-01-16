import type { Metadata, Viewport } from "next";
import { Inter, Noto_Naskh_Arabic, Crimson_Text, Scheherazade_New, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
});

const scheherazadeNew = Scheherazade_New({
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  subsets: ["arabic"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | MEEK",
    default: "MEEK - Learn Quran with Perfect Pronunciation",
  },
  description: "Master Quranic pronunciation with AI-powered feedback. Learn to recite beautifully, one verse at a time.",
  keywords: ["Quran", "Tajweed", "Islam", "Fiqh", "Prayer", "Hanafi", "Learn Quran", "Pronunciation"],
  authors: [{ name: "MEEK Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF5' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
};

import { AuthProvider } from "@/context/AuthContext";

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
          crimsonText.variable,
          scheherazadeNew.variable,
          dmSerifDisplay.variable,
          "antialiased min-h-screen font-sans text-foreground"
        )}
      >
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <ErrorBoundary>
            <main id="main-content" role="main">
              {children}
            </main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}

