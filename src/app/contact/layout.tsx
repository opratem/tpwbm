import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateWebPageSchema, siteConfig } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us - Get in Touch',
  description: 'Contact The Prevailing Word Believers Ministry Inc. Visit us at Asero, Abeokuta. Call +234 813 267 5172 or email info@tpwbm.org. We\'d love to hear from you and answer your questions.',
  path: '/contact',
  keywords: [
    'contact church',
    'church location Abeokuta',
    'church address',
    'church phone number',
    'church email',
    'visit our church',
    'get directions',
    'church contact information',
    'reach us',
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageSchema = generateWebPageSchema({
    name: "Contact Us",
    description: metadata.description as string,
    url: "/contact"
  });

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact The Prevailing Word Believers Ministry",
    description: metadata.description,
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Church",
      name: siteConfig.church.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.church.address.streetAddress,
        addressLocality: siteConfig.church.address.addressLocality,
        addressRegion: siteConfig.church.address.addressRegion,
        addressCountry: siteConfig.church.address.addressCountry
      },
      telephone: siteConfig.church.phone,
      email: siteConfig.church.email
    }
  };

  return (
    <>
      <SEOHead schema={[webPageSchema, contactPageSchema]} />
      {children}
    </>
  );
}
