import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Justin Hatch — Portfolio",
  description: "Data Science, Machine Learning, and Software Engineering projects.",
  openGraph: {
    title: "Justin Hatch — Portfolio",
    description: "Data Science, Machine Learning, and Software Engineering projects.",
    url: "https://justin-portfolio-v1.vercel.app",
    images: [
      {
        url: "https://justin-portfolio-v1.vercel.app/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>

        <meta property="og:title" content="Justin Hatch — Portfolio" />
        <meta property="og:description" content="Data Science, Machine Learning, and Software Engineering projects." />
        <meta property="og:image" content="https://your-domain.com/preview.png" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta property="og:type" content="website" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
