import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Service Times & Weekly Schedule',
  description: 'Join us for worship services. Sunday Bible School at 8:30 AM, Celebration of Jesus at 9:30 AM, and Midweek Service on Wednesdays at 6:00 PM. All are welcome!',
  path: '/services',
  keywords: [
    'church service times',
    'worship schedule',
    'Sunday service',
    'midweek service',
    'church hours',
    'service schedule',
    'when does church start',
    'worship times',
    'Sunday worship',
    'weekly services',
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
