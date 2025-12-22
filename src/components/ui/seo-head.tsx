'use client';

interface SEOHeadProps {
  schema?: object | object[];
}

export function SEOHead({ schema }: SEOHeadProps) {
  if (!schema) return null;

  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
