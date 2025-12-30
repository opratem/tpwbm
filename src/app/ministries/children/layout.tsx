import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateMinistrySchema } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Children\'s Ministry - Nurturing Young Hearts',
  description: 'A fun and safe environment where children learn about God\'s love through age-appropriate Bible lessons, worship, crafts, and activities.',
  path: '/ministries/children',
  keywords: [
    'children ministry',
    'kids church',
    'Sunday school',
    'children\'s program',
    'kids ministry',
    'Bible for kids',
    'children\'s worship',
    'kids activities',
  ],
});

export default function ChildrenMinistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ministrySchema = generateMinistrySchema({
    name: 'Children\'s Ministry - TPWBM',
    description: 'Nurturing young hearts with God\'s love through engaging Bible lessons, worship, and fun activities.',
  });

  return (
    <>
      <SEOHead schema={ministrySchema} />
      {children}
    </>
  );
}
