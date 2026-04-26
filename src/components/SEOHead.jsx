import { Helmet } from 'react-helmet-async';

/**
 * SEOHead – Reusable SEO component for per-page meta tags, Open Graph,
 * Twitter cards, canonical URLs, and JSON-LD structured data.
 *
 * @param {string}  title          – Unique page title (50–60 chars ideal)
 * @param {string}  description    – Meta description (150–160 chars ideal)
 * @param {string}  keywords       – Comma-separated target keywords
 * @param {string}  canonicalPath  – Canonical URL path (e.g. "/about")
 * @param {string}  ogType         – Open Graph type (default: "website")
 * @param {string}  ogImage        – Open Graph image URL
 * @param {object}  structuredData – JSON-LD schema object
 * @param {boolean} noIndex        – If true, prevents indexing (for auth pages)
 */

const SITE_URL = 'https://wavemindsolutions.in';
const SITE_NAME = 'WaveMind Solutions';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

const SEOHead = ({
  title,
  description,
  keywords = '',
  canonicalPath = '/',
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  structuredData = null,
  noIndex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Software Development & IT Services India`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO tags */}
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="IN-WB" />
      <meta name="geo.placename" content="Kolkata" />
      <meta name="theme-color" content="#2563eb" />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
