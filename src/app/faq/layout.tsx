import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Find answers to common questions about The Prevailing Word Believers Ministry Inc. Learn about our services, beliefs, how to join, and more.',
  path: '/faq',
  keywords: [
    'church FAQ',
    'frequently asked questions',
    'church questions',
    'about our church',
    'how to join church',
    'church beliefs',
    'church information',
  ],
});

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
