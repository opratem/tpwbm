import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generatePersonSchema } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Our Pastor - Pastor Tunde Olufemi',
  description: 'Meet Pastor Tunde Olufemi, founder and presiding pastor of The Prevailing Word Believers Ministry Inc. Learn about his vision, ministry journey, and dedication to adding value to lives.',
  path: '/pastor',
  keywords: [
    'Pastor Tunde Olufemi',
    'church pastor',
    'presiding pastor',
    'senior pastor',
    'ministry founder',
    'Christian leader',
    'pastor biography',
    'spiritual leader',
  ],
});

export default function PastorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = generatePersonSchema({
    name: 'Pastor Tunde Olufemi',
    jobTitle: 'Presiding Pastor & Founder',
    description: 'Founder and Presiding Pastor of The Prevailing Word Believers Ministry Inc., dedicated to adding value to lives through the Word of God.',
  });

  return (
    <>
      <SEOHead schema={personSchema} />
      {children}
    </>
  );
}
