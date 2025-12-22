import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Church Announcements & Updates',
  description: 'Stay updated with the latest church announcements, important notices, and ministry updates. Don\'t miss out on what\'s happening in our church community.',
  path: '/announcements',
  keywords: [
    'church announcements',
    'church updates',
    'church news',
    'ministry announcements',
    'church notices',
    'important updates',
    'church bulletin',
    'weekly announcements',
  ],
});

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
