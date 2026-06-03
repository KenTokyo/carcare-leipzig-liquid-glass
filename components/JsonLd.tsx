import React from 'react';

interface JsonLdProps {
  data: unknown | unknown[];
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
