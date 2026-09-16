import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { LeftSidebar } from "@/components/left-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://sterling-desk.vercel.app"
  ),
  title: {
    default: "Sterling — Intelligent AI Agent & Research Assistant",
    template: "%s | Sterling AI",
  },
  description:
    "High-performance AI research assistant and intelligence agent with real-time neural web search, multi-turn reasoning, and instant responses.",
  applicationName: "Sterling AI",
  authors: [{ name: "Sterling AI" }],
  generator: "Next.js",
  keywords: [
    "AI Agent",
    "Deep Research",
    "Neural Search",
    "Exa AI",
    "Reasoning Assistant",
    "Autonomous Agent",
  ],
  creator: "Sterling",
  publisher: "Sterling",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sterling AI",
    title: "Sterling — Intelligent AI Agent & Research Assistant",
    description:
      "High-performance AI research assistant with real-time web search, multi-step reasoning, and clean chat workspace.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Sterling AI Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sterling — Intelligent AI Agent & Research Assistant",
    description:
      "High-performance AI research assistant with real-time web search, multi-step reasoning, and clean chat workspace.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg" },
    ],
  },
  category: "technology",
};

import { STORAGE_KEYS } from '@/constants/storage';

const PRE_HYDRATION_SCRIPT = `
(function() {
  try {
    var storedTheme = localStorage.getItem('${STORAGE_KEYS.THEME}');
    var theme = storedTheme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.add(theme);

    var storedSidebar = localStorage.getItem('${STORAGE_KEYS.SIDEBAR_COLLAPSED}');
    if (storedSidebar === 'true') {
      document.documentElement.classList.add('sidebar-collapsed');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} font-sans h-full h-dvh antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_SCRIPT }} />
      </head>
      <body className="h-full h-dvh bg-theme-bg-base flex flex-row overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
