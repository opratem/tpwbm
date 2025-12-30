import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateWebPageSchema, siteConfig } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Church Events & Programs',
  description: 'Join us for upcoming church events, programs, and special services. Find worship services, youth programs, conferences, and community outreach events. Register online and be part of our growing faith community.',
  path: '/events',
  keywords: [
    'church events',
    'church programs',
    'upcoming events',
    'church calendar',
    'worship events',
    'church conference',
    'youth events',
    'church activities',
    'event registration',
    'church gatherings',
    'ministry events',
    'special services',
    'church schedule',
  ],
});

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageSchema = generateWebPageSchema({
    name: "Church Events & Programs",
    description: metadata.description as string,
    url: "/events"
  });

  const eventsCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Church Events & Programs",
    description: "Browse our upcoming church events, programs, and special services",
    url: `${siteConfig.url}/events`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    about: {
      "@type": "Church",
      name: siteConfig.church.name
    }
  };

  return (
    <>
      <SEOHead schema={[webPageSchema, eventsCollectionSchema]} />
      {children}
    </>
  );
}
