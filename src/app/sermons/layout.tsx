import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateWebPageSchema, siteConfig } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Sermons & Messages',
  description: 'Watch and listen to inspiring sermons and biblical teachings from Pastor Tunde Olufemi. Discover messages on faith, hope, love, and Christian living. Free sermon archive and audio messages.',
  path: '/sermons',
  keywords: [
    'Christian sermons online',
    'Bible teaching',
    'Pastor Tunde Olufemi sermons',
    'free sermon downloads',
    'audio sermons',
    'video sermons',
    'Sunday messages',
    'Christian preaching',
    'biblical teaching',
    'sermon series',
    'faith messages',
    'sermon archive',
    'worship messages',
  ],
});

export default function SermonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageSchema = generateWebPageSchema({
    name: "Sermons & Messages",
    description: metadata.description as string,
    url: "/sermons"
  });

  const sermonCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sermon Archive",
    description: "Browse our collection of inspiring sermons and biblical teachings",
    url: `${siteConfig.url}/sermons`,
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
      <SEOHead schema={[webPageSchema, sermonCollectionSchema]} />
      {children}
    </>
  );
}