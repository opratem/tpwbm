import type { Metadata } from 'next';

export const siteConfig = {
  name: 'The Prevailing Word Believers Ministry Inc.',
  shortName: 'TPWBM',
  description: 'A place where value is added to life. Join us in worship and fellowship as we grow together in faith.',
  url: process.env.NEXTAUTH_URL || 'https://www.tpwbm.com.ng',
  ogImage: '/images/og-image.jpg',
  links: {
    facebook: 'https://www.facebook.com/profile.php?id=100091757649094',
    instagram: 'https://instagram.com/tpwbm',
    youtube: 'https://www.youtube.com/@ThePrevailingWordBelieversMinistry',
  },
  contact: {
    email: 'prevailingword95@gmail.com',
    phone: '+234',
    address: '1 TPWBM Avenue, Lagos, Nigeria',
  },
  church: {
    name: 'The Prevailing Word Believers Ministry Inc.',
    foundingDate: '1994',
    founder: 'Pastor Tunde Olufemi',
    email: 'prevailingword95@gmail.com',
    phone: '+234',
    address: {
      streetAddress: '1 TPWBM Avenue',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
  },
  services: [
    { day: 'Sunday', name: 'Sunday Bible School', time: '8:30 AM - 9:30 AM' },
    { day: 'Sunday', name: 'Celebration of Jesus', time: '9:30 AM - 12:00 PM' },
    { day: 'Tuesday', name: 'Midweek Bible Study', time: '5:00 PM - 6:30 PM' },
  ],
};

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  path?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

export function generateMetadata(props: SEOProps): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = [],
    canonicalUrl,
    path,
    ogImage = siteConfig.ogImage,
    ogType,
    type,
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
  } = props;

  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageType = type || ogType || 'website';
  const url = canonicalUrl || (path ? `${siteConfig.url}${path}` : siteConfig.url);
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`;

  const defaultKeywords = [
    'TPWBM',
    'The Prevailing Word Believers Ministry',
    'church',
    'Lagos church',
    'Abeokuta church',
    'Christian ministry Nigeria',
    'worship',
    'Bible study',
    'prayer',
    'sermons',
    'spiritual growth',
    'faith community',
    'Christian fellowship',
    'online giving',
    'tithing',
    'church events',
  ];

  return {
    title: pageTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: author ? [{ name: author }] : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: pageType,
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_NG',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [imageUrl],
      creator: '@tpwbm',
      site: '@tpwbm',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

// JSON-LD Structured Data Generators

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Lagos',
      streetAddress: siteConfig.contact.address,
    },
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.instagram,
      siteConfig.links.youtube,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: siteConfig.contact.email,
      availableLanguage: ['en'],
    },
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  url?: string;
  organizer?: string;
  price?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.church.address.streetAddress,
        addressLocality: siteConfig.church.address.addressLocality,
        addressRegion: siteConfig.church.address.addressRegion,
        addressCountry: siteConfig.church.address.addressCountry,
      },
    },
    image: event.image ? (event.image.startsWith('http') ? event.image : `${siteConfig.url}${event.image}`) : `${siteConfig.url}${siteConfig.ogImage}`,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || siteConfig.church.name,
      url: siteConfig.url,
    },
    offers: {
      '@type': 'Offer',
      price: event.price || '0',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      url: event.url || siteConfig.url,
    },
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || siteConfig.ogImage,
    datePublished: post.publishedTime,
    dateModified: post.modifiedTime || post.publishedTime,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: siteConfig.name,
    url: siteConfig.url,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Church Services',
      itemListElement: siteConfig.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: `${service.day} service at ${service.time}`,
        },
      })),
    },
  };
}

export function generateWebPageSchema(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: `${siteConfig.url}${params.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Church',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };
}

export function generateDonationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: 'Support Our Ministry',
    description: 'Give your tithes, offerings, and donations securely to support our ministry work.',
    recipient: {
      '@type': 'Church',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    actionStatus: 'https://schema.org/PotentialActionStatus',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/giving`,
      actionPlatform: [
        'https://schema.org/DesktopWebPlatform',
        'https://schema.org/MobileWebPlatform',
      ],
    },
  };
}

export function generateMinistrySchema(params: {
  name: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name,
    description: params.description,
    parentOrganization: {
      '@type': 'Church',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    memberOf: {
      '@type': 'Church',
      name: siteConfig.name,
    },
  };
}

export function generatePersonSchema(params: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    jobTitle: params.jobTitle,
    description: params.description,
    worksFor: {
      '@type': 'Church',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(params.image && {
      image: {
        '@type': 'ImageObject',
        url: params.image,
      },
    }),
  };
}

// Generate BlogPosting Schema (JSON-LD)
export function generateBlogPostingSchema(post: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? (post.image.startsWith('http') ? post.image : `${siteConfig.url}${post.image}`) : `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.church.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/CHURCH%20LOGO.png`,
      },
    },
    url: post.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

// Generate FAQ Schema (JSON-LD)
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate WebSite Schema (JSON-LD)
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.church.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// Generate Sermon Schema (AudioObject for audio sermons)
export function generateSermonSchema(sermon: {
  title: string;
  description: string;
  audioUrl: string;
  duration?: string;
  uploadDate: string;
  speaker?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: sermon.title,
    description: sermon.description,
    contentUrl: sermon.audioUrl,
    duration: sermon.duration,
    uploadDate: sermon.uploadDate,
    author: {
      '@type': 'Person',
      name: sermon.speaker || siteConfig.church.founder,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.church.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/CHURCH%20LOGO.png`,
      },
    },
  };
}

// Generate Video Sermon Schema (VideoObject for YouTube/video sermons)
export function generateVideoSermonSchema(sermon: {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  uploadDate: string;
  speaker?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: sermon.title,
    description: sermon.description,
    contentUrl: sermon.videoUrl,
    thumbnailUrl: sermon.thumbnailUrl || `${siteConfig.url}${siteConfig.ogImage}`,
    duration: sermon.duration,
    uploadDate: sermon.uploadDate,
    author: {
      '@type': 'Person',
      name: sermon.speaker || siteConfig.church.founder,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.church.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/CHURCH%20LOGO.png`,
      },
    },
  };
}

// Generate CollectionPage Schema for sermon listing
export function generateCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: `${siteConfig.url}${params.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}