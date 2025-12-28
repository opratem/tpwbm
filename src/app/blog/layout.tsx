import type { Metadata } from 'next';
import { generateMetadata as createMetadata, generateWebPageSchema, siteConfig } from '@/lib/seo';
import { SEOHead } from '@/components/ui/seo-head';

export const metadata: Metadata = createMetadata({
  title: 'Blog - Christian Articles, Testimonies & Ministry Updates',
  description: 'Read inspiring Christian articles, powerful testimonies, devotionals, and ministry updates. Grow in faith through biblical insights and real-life stories of God\'s goodness.',
  path: '/blog',
  type: 'website',
  keywords: [
    'Christian blog',
    'church blog',
    'Christian articles',
    'testimonies',
    'devotionals',
    'ministry updates',
    'faith stories',
    'Christian living',
    'spiritual growth blog',
    'Bible devotions',
    'Christian lifestyle',
    'inspirational articles',
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageSchema = generateWebPageSchema({
    name: "Blog - Articles & Testimonies",
    description: metadata.description as string,
    url: "/blog"
  });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TPWBM Blog",
    description: "Christian articles, testimonies, and ministry updates",
    url: `${siteConfig.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/CHURCH%20LOGO.png`
      }
    }
  };

  return (
    <>
      <SEOHead schema={[webPageSchema, blogSchema]} />
      {children}
    </>
  );
}
