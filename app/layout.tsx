import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splitwisely | Split expenses without stress",
  description:
    "Split expenses with friends and roommates. Track balances, settle up, and manage group finances effortlessly.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Splitwisely",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#3b82f6" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Splitwisely" />
          <link rel="apple-touch-icon" href="/icon-192.png" />
        </head>
        <body
          suppressHydrationWarning
          className={`
            ${geistSans.variable} 
            ${geistMono.variable} 
            antialiased 
            min-h-screen
          `}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}