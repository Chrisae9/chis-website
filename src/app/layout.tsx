import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chris's Blog - Tech Tutorials & Guides",
  description: "A personal blog featuring tech tutorials, guides, and insights on software development, system administration, and various tech topics.",
  keywords: "tech blog, tutorials, guides, software development, system administration, docker, linux, programming",
  authors: [{ name: "Chris" }],
  creator: "Chris",
  publisher: "chis.dev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chis.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Chris's Blog - Tech Tutorials & Guides",
    description: "A personal blog featuring tech tutorials, guides, and insights on software development and system administration",
    url: 'https://chis.dev',
    siteName: "Chris's Blog",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chris's Blog - Tech Tutorials & Guides",
    description: "A personal blog featuring tech tutorials, guides, and insights on software development and system administration",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} h-full min-h-screen bg-gray-50 dark:bg-gray-900`}>{children}</body>
    </html>
  );
}
