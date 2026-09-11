import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: {
    default: "The Angle Report",
    template: "%s | The Angle Report",
  },

  description:
    "Understand the full story through evidence, context, source analysis, and multiple perspectives. The Angle Report helps you see every angle behind the news.",

  applicationName: "The Angle Report",

  keywords: [
    "The Angle Report",
    "news analysis",
    "political news",
    "news intelligence",
    "AI news analysis",
    "political analysis",
    "fact checking",
    "multiple perspectives",
    "source analysis",
    "media bias analysis",
    "political intelligence",
  ],

  authors: [
    {
      name: "The Angle Report",
    },
  ],

  creator: "The Angle Report",
  publisher: "The Angle Report",

  category: "news",

  openGraph: {
    type: "website",
    siteName: "The Angle Report",
    title: "The Angle Report | Ideas From Every Side",
    description:
      "Go beyond the headline with evidence, context, source analysis, and multiple perspectives.",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Angle Report | Ideas From Every Side",
    description:
      "Go beyond the headline with evidence, context, source analysis, and multiple perspectives.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#020D21]">
        {children}
      </body>
    </html>
  );
}