import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Konami } from "@/components/Konami";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["700", "800"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const description = "I build software in public. Once a week: what I built, what broke, what I learned.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description,
  openGraph: {
    title: `${site.name} — I build software in public`,
    description: "The reels show 30 seconds. This is the rest, once a week.",
    url: site.url,
    siteName: site.domain,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh font-sans text-base leading-[1.55]">
        {children}
        <Konami />
        <Analytics />
      </body>
    </html>
  );
}
