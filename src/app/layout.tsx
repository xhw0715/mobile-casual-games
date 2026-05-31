import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { HotGames } from "@/components/HotGames";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "casual games",
    "mobile games",
    "free games",
    "online games",
    "casual gaming community",
    "play games",
    "game discovery",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
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
  alternates: {
    canonical: SITE.url,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/discover?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-screen flex flex-col overflow-hidden bg-white font-sans text-slate-800">
        <Navbar />
        <div className="flex flex-1 min-h-0 pt-20 justify-center">
          <div className="flex w-full" style={{ maxWidth: 1200 }}>
            <aside className="hidden lg:block w-60 shrink-0 border-r border-slate-100 bg-white">
              <Sidebar />
            </aside>
            <div className="flex-1 min-w-0 overflow-y-auto">
              <div className="flex min-h-full">
                <main className="flex-1 min-w-0 bg-slate-50/30">
                  {children}
                </main>
                <aside className="hidden xl:block w-72 shrink-0 border-l border-slate-100">
                  <HotGames />
                </aside>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
