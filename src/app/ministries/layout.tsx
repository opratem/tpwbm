import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Church Ministries',
  description: 'Discover our church ministries serving different age groups and purposes. Join our children, youth, men, women, music, ushers, and special ministries.',
  path: '/ministries',
  keywords: [
    'church ministries',
    'ministry programs',
    'church departments',
    'get involved',
    'serve in ministry',
    'church groups',
    'ministry opportunities',
  ],
});

export default function MinistriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
