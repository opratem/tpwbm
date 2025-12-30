import type { Metadata } from 'next';
import { generateMetadata as genMeta, generateDonationSchema, siteConfig } from '@/lib/seo';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

// SEO Metadata
export const metadata: Metadata = genMeta({
  title: 'Give & Support Our Ministry',
  description: 'Support The Prevailing Word Believers Ministry through your tithes, offerings, and donations. Give securely online or via bank transfer to help us continue God\'s work.',
  keywords: [
    'church giving',
    'online tithing',
    'church donations',
    'support ministry',
    'church offering online',
    'tithe online Nigeria',
    'church donation Nigeria',
    'give to church',
    'ministry support',
    'church financial support',
    'online church giving',
    'digital tithe',
  ],
  path: '/giving',
  ogImage: '/images/giving-og.jpg',
});

export default function GivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate JSON-LD schema
  const donationSchema = generateDonationSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donationSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Page Content */}
      {children}
    </>
  );
}
