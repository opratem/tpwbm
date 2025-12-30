import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateMinistrySchema } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Women\'s Ministry - House of Grace',
  description: 'Join House of Grace women\'s ministry for fellowship, discipleship, prayer, and empowerment. Building godly women who impact their families and communities.',
  path: '/ministries/women',
  keywords: [
    'women ministry',
    'women\'s fellowship',
    'House of Grace',
    'Christian women',
    'women\'s group',
    'ladies ministry',
    'women empowerment',
    'women discipleship',
  ],
});

export default function WomenMinistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ministrySchema = generateMinistrySchema({
    name: 'Women\'s Ministry - House of Grace',
    description: 'Empowering women through fellowship, discipleship, and prayer to impact their families and communities.',
  });

  return (
    <>
      <SEOHead schema={ministrySchema} />
      {children}
    </>
  );
}
