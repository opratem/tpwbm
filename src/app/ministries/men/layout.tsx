import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateMinistrySchema } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Men\'s Ministry - Building Godly Men',
  description: 'A brotherhood of men committed to growing spiritually, supporting each other, and becoming godly leaders in their families, church, and communities.',
  path: '/ministries/men',
  keywords: [
    'men ministry',
    'men\'s fellowship',
    'Christian men',
    'men\'s group',
    'godly leadership',
    'men discipleship',
    'brotherhood',
  ],
});

export default function MenMinistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ministrySchema = generateMinistrySchema({
    name: 'Men\'s Ministry - TPWBM',
    description: 'Building godly men who lead with integrity and serve their families, church, and communities.',
  });

  return (
    <>
      <SEOHead schema={ministrySchema} />
      {children}
    </>
  );
}
