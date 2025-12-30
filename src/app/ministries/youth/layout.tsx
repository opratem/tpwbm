import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateMinistrySchema } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Youth Ministry - Empowering Young People',
  description: 'Join our vibrant youth ministry designed for teenagers and young adults. Experience dynamic worship, biblical teaching, fellowship, and activities that strengthen faith.',
  path: '/ministries/youth',
  keywords: [
    'youth ministry',
    'youth church',
    'teen ministry',
    'young adults ministry',
    'youth group',
    'youth activities',
    'youth fellowship',
    'Christian youth',
  ],
});

export default function YouthMinistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ministrySchema = generateMinistrySchema({
    name: 'Youth Ministry - TPWBM',
    description: 'A vibrant ministry empowering teenagers and young adults through biblical teaching, fellowship, and life-changing activities.',
  });

  return (
    <>
      <SEOHead schema={ministrySchema} />
      {children}
    </>
  );
}
