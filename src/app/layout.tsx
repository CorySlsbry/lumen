import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumen — a little light on your money",
    template: "%s · Lumen",
  },
  description:
    "Round-up savings, tarot, and birth-chart horoscopes — finance that feels human. Built for the six kinds of money lives.",
  applicationName: "Lumen",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumen",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Lumen — a little light on your money",
    description:
      "The first finance app that doesn't feel like homework. Round-ups, tarot, and astrology that actually moves the needle.",
    type: "website",
    siteName: "Lumen",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1a1033",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
