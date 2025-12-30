import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateWebPageSchema, generateOrganizationSchema, siteConfig } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'About Us - Our Story, Mission & Values',
  description: 'Learn about The Prevailing Word Believers Ministry Inc. - our history since 1994, mission to add value to lives, core values, leadership, and vision for the future. Discover how we serve Abeokuta and beyond.',
  path: '/about',
  keywords: [
    'about our church',
    'church history',
    'church mission',
    'church values',
    'Pastor Tunde Olufemi',
    'church leadership',
    'church vision',
    'Christian ministry Abeokuta',
    'founded 1994',
    'church story',
    'our beliefs',
    'what we believe',
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About The Prevailing Word Believers Ministry",
    description: metadata.description,
    url: `${siteConfig.url}/about`,
    mainEntity: {
      "@type": "Church",
      name: siteConfig.church.name,
      foundingDate: siteConfig.church.foundingDate,
      founder: {
        "@type": "Person",
        name: siteConfig.church.founder,
        jobTitle: "Presiding Pastor"
      },
      description: siteConfig.description
    }
  };

  return (
    <>
      <SEOHead schema={[organizationSchema, aboutPageSchema]} />
      {children}
    </>
  );
}