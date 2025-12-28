import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Live Streaming - Watch Church Services Online',
  description: 'Watch our church services live online. Join us virtually for Sunday worship, midweek services, and special events. Stream live and connect with our faith community from anywhere.',
  path: '/live-streaming',
  keywords: [
    'church live stream',
    'watch church online',
    'online worship service',
    'live church service',
    'virtual church',
    'streaming worship',
    'watch service live',
    'online Sunday service',
    'live broadcast',
    'church online',
  ],
});

export default function LiveStreamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
