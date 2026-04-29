import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';

const SITE_URL = 'https://wavemindsolutions.in';
const SITE_NAME = 'WaveMind Solutions';

/**
 * BlogLayout – Reusable wrapper for all blog posts.
 * Injects Article schema, proper meta tags, and consistent layout.
 *
 * Props:
 *  title        – Blog post title
 *  description  – Meta description (150-160 chars)
 *  keywords     – Target keywords string
 *  author       – Author name (default: WaveMind Solutions)
 *  publishDate  – ISO date string e.g. "2026-04-29"
 *  modifiedDate – ISO date string (defaults to publishDate)
 *  slug         – URL slug e.g. "/blog/how-much-does-website-cost-india"
 *  tags         – Array of tag strings
 *  readTime     – Estimated read time string e.g. "5 min read"
 *  children     – Blog post content JSX
 */
const BlogLayout = ({
  title,
  description,
  keywords = '',
  author = 'WaveMind Solutions',
  publishDate,
  modifiedDate,
  slug,
  tags = [],
  readTime = '5 min read',
  children,
}) => {
  const canonicalUrl = `${SITE_URL}${slug}`;
  const fullTitle = `${title} | ${SITE_NAME} Blog`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": canonicalUrl,
    "datePublished": publishDate,
    "dateModified": modifiedDate || publishDate,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": SITE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": title, "item": canonicalUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="author" content={author} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_IN" />
        {publishDate && <meta property="article:published_time" content={publishDate} />}
        {(modifiedDate || publishDate) && <meta property="article:modified_time" content={modifiedDate || publishDate} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-24 pb-4">
          <div className="container mx-auto px-6 max-w-3xl">
            <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li>/</li>
              <li className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{title}</li>
            </ol>
          </div>
        </nav>

        <article className="container mx-auto px-6 max-w-3xl pb-20">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <span className="font-medium text-gray-700 dark:text-gray-300">{author}</span>
            {publishDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
          </div>

          {/* Post content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-600 dark:prose-p:text-gray-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-li:text-gray-600 dark:prose-li:text-gray-300
            prose-blockquote:border-blue-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1
          ">
            {children}
          </div>

          {/* CTA Box */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Need Help with Your Business?</h2>
            <p className="text-blue-100 mb-6">WaveMind Solutions helps Indian startups and MSMEs with web development, SEO, CRM, ERP, and automation.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold text-sm hover:shadow-lg transition-all">
                Get Free Consultation
              </Link>
              <Link to="/services" className="px-6 py-3 border-2 border-white/30 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition-all">
                Our Services
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogLayout;
