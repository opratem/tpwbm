import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { generateMetadata as createMetadata, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    title: "The Prevailing Word Believers Ministry Inc.",
    description: "A place where value is added to life. Join us in worship and fellowship as we grow together in faith. Christian ministry serving Abeokuta, Lagos and beyond.",
    path: "/",
    keywords: [
      "church in Abeokuta",
      "church in Lagos",
      "Christian ministry Nigeria",
      "online sermons",
      "church giving",
      "tithing online",
      "prayer requests",
      "worship service",
      "Bible teaching",
      "Pastor Tunde Olufemi",
      "spiritual growth",
      "Christian fellowship",
      "church events",
      "live streaming church",
      "online church Nigeria",
    ],
  }),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/CHURCH%20LOGO.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="hsl(218, 31%, 18%)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Organization Schema - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* WebSite Schema - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {/* Plausible Analytics */}
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src={plausibleSrc}
            strategy="afterInteractive"
          />
        )}
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
