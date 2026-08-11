/**
 * WaveMind Solutions – Centralized AI Website Pricing Engine
 * Official Baseline Price Matrix & Calculation Engine
 */

export const OFFICIAL_WEBSITE_PRICING = {
  business: {
    key: 'business',
    label: 'Business Website',
    min: 15000,
    recommended: 35000,
    max: 100000,
    description: 'Corporate, small business, & company landing sites',
    aliases: ['business', 'business website', 'corporate', 'company']
  },
  ecommerce: {
    key: 'ecommerce',
    label: 'E-commerce',
    min: 30000,
    recommended: 75000,
    max: 300000,
    description: 'Online stores, product catalogs, cart & checkout systems',
    aliases: ['e-commerce', 'ecommerce', 'online store', 'shop', 'shopping app']
  },
  portfolio: {
    key: 'portfolio',
    label: 'Portfolio',
    min: 10000,
    recommended: 25000,
    max: 75000,
    description: 'Personal, creator, agency, & professional showcases',
    aliases: ['portfolio', 'personal website', 'resume', 'showcase']
  },
  blog: {
    key: 'blog',
    label: 'Blog',
    min: 10000,
    recommended: 25000,
    max: 60000,
    description: 'Content hubs, news portals, & online publishing sites',
    aliases: ['blog', 'magazine', 'news portal', 'content site']
  },
  education: {
    key: 'education',
    label: 'Education Website',
    min: 20000,
    recommended: 50000,
    max: 150000,
    description: 'LMS, course portals, schools, & educational institutions',
    aliases: ['education website', 'education', 'lms', 'course portal', 'school website', 'learning platform']
  },
  booking: {
    key: 'booking',
    label: 'Booking / Service Website',
    min: 20000,
    recommended: 50000,
    max: 150000,
    description: 'Appointment scheduling, consultations, & service marketplaces',
    aliases: ['booking / service website', 'booking', 'service website', 'appointment portal', 'consultation']
  },
  custom: {
    key: 'custom',
    label: 'Custom Website / Web App',
    min: 50000,
    recommended: 150000,
    max: 500000,
    description: 'SaaS platforms, complex web applications, & enterprise systems',
    aliases: ['custom website / web app', 'custom website', 'custom', 'web app', 'saas', 'custom web app', 'enterprise']
  }
};

/**
 * Normalizes any website type input string to match official pricing category
 * @param {string} inputType
 * @param {Object} [customMatrix]
 * @returns {Object} Pricing config item
 */
export function getPricingForCategory(inputType = '', customMatrix = null) {
  const matrix = customMatrix || OFFICIAL_WEBSITE_PRICING;
  const cleanInput = (inputType || '').toString().toLowerCase().trim();

  if (!cleanInput) {
    return matrix.business || OFFICIAL_WEBSITE_PRICING.business;
  }

  // Exact key match
  if (matrix[cleanInput]) {
    return matrix[cleanInput];
  }

  // Search across categories by label or aliases
  for (const key of Object.keys(matrix)) {
    const item = matrix[key];
    if (
      item.key.toLowerCase() === cleanInput ||
      item.label.toLowerCase() === cleanInput
    ) {
      return item;
    }

    if (item.aliases && item.aliases.some(alias => cleanInput.includes(alias) || alias.includes(cleanInput))) {
      return item;
    }
  }

  // Generic fallback checks
  if (cleanInput.includes('e-commerce') || cleanInput.includes('ecommerce') || cleanInput.includes('shop') || cleanInput.includes('store')) {
    return matrix.ecommerce || OFFICIAL_WEBSITE_PRICING.ecommerce;
  }
  if (cleanInput.includes('portfolio') || cleanInput.includes('resume')) {
    return matrix.portfolio || OFFICIAL_WEBSITE_PRICING.portfolio;
  }
  if (cleanInput.includes('blog') || cleanInput.includes('news') || cleanInput.includes('article')) {
    return matrix.blog || OFFICIAL_WEBSITE_PRICING.blog;
  }
  if (cleanInput.includes('educat') || cleanInput.includes('lms') || cleanInput.includes('course') || cleanInput.includes('school')) {
    return matrix.education || OFFICIAL_WEBSITE_PRICING.education;
  }
  if (cleanInput.includes('book') || cleanInput.includes('service') || cleanInput.includes('appointment')) {
    return matrix.booking || OFFICIAL_WEBSITE_PRICING.booking;
  }
  if (cleanInput.includes('custom') || cleanInput.includes('saas') || cleanInput.includes('app') || cleanInput.includes('enterprise')) {
    return matrix.custom || OFFICIAL_WEBSITE_PRICING.custom;
  }

  return matrix.business || OFFICIAL_WEBSITE_PRICING.business;
}

/**
 * Format monetary amount in Indian Rupees (en-IN)
 * @param {number} amount
 * @returns {string} e.g. "₹15,000"
 */
export function formatINR(amount) {
  const numeric = Math.max(0, Number(amount) || 0);
  return `₹${numeric.toLocaleString('en-IN')}`;
}

/**
 * Validate customer budget against category minimum price
 * @param {string} categoryInput
 * @param {number|string} budgetInput
 * @param {Object} [customMatrix]
 * @returns {{ isValid: boolean, minRequired: number, category: Object, message: string }}
 */
export function validateBudget(categoryInput, budgetInput, customMatrix = null) {
  const category = getPricingForCategory(categoryInput, customMatrix);
  const budget = Number((budgetInput || '0').toString().replace(/[^\d]/g, '')) || 0;

  if (budget < category.min) {
    return {
      isValid: false,
      minRequired: category.min,
      category,
      message: `The minimum development price for ${category.label} at WaveMind Solutions is ${formatINR(category.min)}. Your current budget is below the minimum required for this project.`
    };
  }

  return {
    isValid: true,
    minRequired: category.min,
    category,
    message: `Budget is valid for ${category.label}.`
  };
}

/**
 * Calculate recommended price level & range based on project parameters
 * Formula: Math.max(calculatedPrice, category.min)
 * @param {Object} params
 * @returns {Object} Detailed price calculation breakdown
 */
export function calculateProjectPrice({
  websiteType = 'Business Website',
  pagesCount = 5,
  designComplexity = 'Professional',
  features = [],
  animationComplexity = 'Basic animations',
  backendComplexity = 'Basic backend',
  customMatrix = null
}) {
  const category = getPricingForCategory(websiteType, customMatrix);
  let basePrice = category.recommended;

  // Pages modifier
  const numPages = Number(pagesCount) || 5;
  let pageModifier = 0;
  if (numPages > 10) {
    pageModifier = (numPages - 10) * 2000;
  } else if (numPages <= 3) {
    pageModifier = -5000;
  }

  // Design modifier
  let designModifier = 0;
  const design = (designComplexity || '').toLowerCase();
  if (design.includes('basic')) designModifier = -5000;
  else if (design.includes('premium')) designModifier = 15000;
  else if (design.includes('custom')) designModifier = 30000;

  // Features modifier
  const numFeatures = Array.isArray(features) ? features.length : 0;
  let featureModifier = numFeatures * 3500;

  // Animation modifier
  let animationModifier = 0;
  const anim = (animationComplexity || '').toLowerCase();
  if (anim.includes('advanced') || anim.includes('gsap') || anim.includes('framer')) animationModifier = 10000;
  if (anim.includes('three') || anim.includes('3d')) animationModifier = 25000;

  // Backend modifier
  let backendModifier = 0;
  const backend = (backendComplexity || '').toLowerCase();
  if (backend.includes('complex') || backend.includes('multiple apis') || backend.includes('real-time')) backendModifier = 20000;
  if (backend.includes('static')) backendModifier = -5000;

  const rawCalculated = basePrice + pageModifier + designModifier + featureModifier + animationModifier + backendModifier;

  // HARD MINIMUM RULE ENFORCEMENT
  const estimatedCost = Math.max(rawCalculated, category.min);

  // Range calculation
  const minRange = Math.max(category.min, Math.round(estimatedCost * 0.85 / 1000) * 1000);
  const maxRange = Math.max(minRange + 10000, Math.round(estimatedCost * 1.2 / 1000) * 1000);

  // Recommendation Level classification
  let level = 'Professional';
  if (estimatedCost <= category.min * 1.3) {
    level = 'Basic';
  } else if (estimatedCost >= category.max * 0.8 || estimatedCost >= 150000) {
    level = estimatedCost >= 250000 ? 'Enterprise / Advanced' : 'Premium';
  }

  return {
    category,
    estimatedCost,
    recommendedRangeText: `${formatINR(minRange)} – ${formatINR(maxRange)}`,
    minRange,
    maxRange,
    level,
    breakdown: {
      basePrice,
      pageModifier,
      designModifier,
      featureModifier,
      animationModifier,
      backendModifier
    }
  };
}

/**
 * Generate preset budget options for budget selector starting from category minimum
 * @param {string} websiteType
 * @param {Object} [customMatrix]
 * @returns {number[]} Array of numbers >= category.min
 */
export function getBudgetPresetOptions(websiteType, customMatrix = null) {
  const category = getPricingForCategory(websiteType, customMatrix);
  const allPresets = [10000, 15000, 20000, 25000, 30000, 35000, 50000, 75000, 100000, 150000, 250000, 300000, 500000];

  // Filter out any option below the category minimum
  const validPresets = allPresets.filter(val => val >= category.min);

  // Ensure minimum is always included as first option
  if (!validPresets.includes(category.min)) {
    validPresets.unshift(category.min);
    validPresets.sort((a, b) => a - b);
  }

  return validPresets.slice(0, 7);
}
