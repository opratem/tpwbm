import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Photo Gallery - Church Events & Memories',
  description: 'Browse our church photo gallery featuring moments from worship services, ministry events, conferences, and community outreach. See our church family in action.',
  path: '/gallery',
  keywords: [
    'church photos',
    'church gallery',
    'event photos',
    'church pictures',
    'ministry photos',
    'worship photos',
    'church events gallery',
    'photo album',
  ],
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
