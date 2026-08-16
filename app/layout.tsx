import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "MT_ROOT — Learn. Build. Secure. Compete.", template: "%s | MT_ROOT" },
  description: "Cybersecurity, programming and technology community.",
  metadataBase: new URL("https://mt-root.uz"),
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: "https://mt-root.uz",
    siteName: "MT_ROOT",
    title: "MT_ROOT — Learn. Build. Secure. Compete.",
    description: "Cybersecurity, programming and technology community.",
  },
  twitter: { card: "summary_large_image", title: "MT_ROOT", description: "Learn. Build. Secure. Compete." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head><link rel="manifest" href="/manifest.json" /></head>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
