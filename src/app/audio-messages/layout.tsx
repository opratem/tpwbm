import type { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Audio Messages & Sermon Recordings',
  description: 'Listen to audio recordings of sermons and teachings from Pastor Tunde Olufemi. Download or stream powerful messages on faith, hope, and Christian living.',
  path: '/audio-messages',
  keywords: [
    'audio sermons',
    'sermon recordings',
    'Christian audio messages',
    'download sermons',
    'listen to sermons',
    'audio teachings',
    'podcast sermons',
    'sermon audio',
    'free sermon downloads',
  ],
});

export default function AudioMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
