import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Church Leadership Team',
  description: 'Meet the dedicated leadership team of The Prevailing Word Believers Ministry Inc. Learn about our pastors, ministers, and leaders who shepherd and guide our congregation.',
  path: '/leadership',
  keywords: [
    'church leadership',
    'pastoral team',
    'church ministers',
    'ministry leaders',
    'church staff',
    'leadership team',
    'church pastors',
    'ministry team',
  ],
});

export default function LeadershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
