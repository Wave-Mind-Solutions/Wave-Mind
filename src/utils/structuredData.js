/**
 * Centralized JSON-LD Structured Data schemas for WaveMind Solutions.
 * Compliant with Google's structured data guidelines.
 */

const SITE_URL = 'https://wavemindsolutions.in';

// Organization schema — used site-wide
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WaveMind Solutions",
  "alternateName": "WaveMind",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": "WaveMind Solutions is a web development company in Kolkata, India, delivering scalable SaaS platforms, mobile apps, AI-powered solutions, and cloud-based software for startups and growing businesses.",
  "foundingDate": "2023",
  "founders": [
    {
      "@type": "Person",
      "name": "Pinak Majumder",
      "jobTitle": "Chief Executive Officer"
    },
    {
      "@type": "Person",
      "name": "Abhishek Dutta Roy",
      "jobTitle": "Co-Founder"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@wavemindsolutions.in",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi", "Bengali"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/wavemind-solutions/",
    "https://www.instagram.com/wavemindsolutions",
    "https://www.facebook.com/wavemindsolutions"
  ]
};

// Website schema with SearchAction
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "WaveMind Solutions",
  "url": SITE_URL,
  "description": "Premium software development, mobile apps, AI solutions, and cloud infrastructure services from India.",
  "publisher": {
    "@type": "Organization",
    "name": "WaveMind Solutions",
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`
    }
  }
};

// Home page (SoftwareApplication + ITService)
export const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "WaveMind Solutions",
  "image": `${SITE_URL}/logo.png`,
  "url": SITE_URL,
  "telephone": "",
  "email": "info@wavemindsolutions.in",
  "description": "Kolkata's best web development company and premier software agency delivering SaaS platforms, mobile apps, AI integrations, and enterprise tools.",
  "priceRange": "₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "addressCountry": "IN"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150",
    "bestRating": "5"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Application Development",
          "description": "Custom React, Next.js & Node.js web application development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mobile App Development",
          "description": "Cross-platform iOS and Android mobile applications"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI & Machine Learning",
          "description": "LLM integration, computer vision, and AI-powered solutions"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cloud Infrastructure & DevOps",
          "description": "AWS, GCP cloud architecture and DevOps automation"
        }
      }
    ]
  }
};

// Services page schema
export const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "WaveMind Solutions Services",
  "description": "Comprehensive software development services including web apps, mobile apps, AI, cloud infrastructure, and UI/UX design.",
  "numberOfItems": 6,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "Web Development",
        "description": "Custom web applications built with React, Next.js, and Node.js for high performance and scalability.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Service",
        "name": "Mobile App Development",
        "description": "Native and cross-platform mobile apps for iOS and Android with intuitive UX.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Service",
        "name": "Cloud & DevOps",
        "description": "Scalable cloud infrastructure on AWS and GCP with CI/CD automation.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Service",
        "name": "AI & Machine Learning",
        "description": "Intelligent AI solutions including LLM integrations and data analytics.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Service",
        "name": "UI/UX Design",
        "description": "Premium user interface and experience design for web and mobile platforms.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Service",
        "name": "Security & Compliance",
        "description": "Enterprise-grade security audits, encryption, and compliance frameworks.",
        "provider": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    }
  ]
};

// About page schema
export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About WaveMind Solutions",
  "description": "Learn about WaveMind Solutions — our mission, values, and the team driving innovation in software development since 2023.",
  "url": `${SITE_URL}/about`,
  "mainEntity": {
    "@type": "Organization",
    "name": "WaveMind Solutions",
    "foundingDate": "2023",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "20+"
    }
  }
};

// Contact page schema
export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact WaveMind Solutions",
  "description": "Get in touch with WaveMind Solutions for project inquiries, quotes, and partnerships.",
  "url": `${SITE_URL}/contact`,
  "mainEntity": {
    "@type": "Organization",
    "name": "WaveMind Solutions",
    "email": "info@wavemindsolutions.in",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales & Support",
      "email": "info@wavemindsolutions.in",
      "availableLanguage": ["English", "Hindi", "Bengali"]
    }
  }
};

// Leadership page schema
export const leadershipPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Leadership Team – WaveMind Solutions",
  "description": "Meet the leadership team behind WaveMind Solutions.",
  "url": `${SITE_URL}/leadership`,
  "mainEntity": {
    "@type": "Organization",
    "name": "WaveMind Solutions",
    "member": [
      {
        "@type": "Person",
        "name": "Pinak Majumder",
        "jobTitle": "Chief Executive Officer",
        "worksFor": { "@type": "Organization", "name": "WaveMind Solutions" }
      },
      {
        "@type": "Person",
        "name": "Abhishek Dutta Roy",
        "jobTitle": "Co-Founder",
        "worksFor": { "@type": "Organization", "name": "WaveMind Solutions" }
      },
      {
        "@type": "Person",
        "name": "Tanny Banerjee",
        "jobTitle": "Director of Management",
        "worksFor": { "@type": "Organization", "name": "WaveMind Solutions" }
      },
      {
        "@type": "Person",
        "name": "Debalina Saha",
        "jobTitle": "Director of Operations",
        "worksFor": { "@type": "Organization", "name": "WaveMind Solutions" }
      },
      {
        "@type": "Person",
        "name": "Ankita",
        "jobTitle": "Director of Client Success",
        "worksFor": { "@type": "Organization", "name": "WaveMind Solutions" }
      }
    ]
  }
};

// FAQ schema for Home page
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How fast can you deliver a project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most initial MVP builds take between 2-4 weeks, depending on complexity. We work in rapid sprints to get your product to market faster."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide ongoing support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer comprehensive maintenance and scaling support packages after the initial launch."
      }
    },
    {
      "@type": "Question",
      "name": "What technologies do you use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We specialize in modern stacks: React, Next.js, Node.js, Python, and cloud infrastructure on AWS/GCP."
      }
    },
    {
      "@type": "Question",
      "name": "Can I upgrade my plan later?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Our solutions are built to scale. You can start small and expand your feature set as your user base grows."
      }
    }
  ]
};

// Breadcrumb generator
export const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${SITE_URL}${item.path}`
  }))
});
