/**
 * Feature Flag & A/B Testing Utility
 * Helps in determining which variant to show to a user
 */

export const getExperimentVariant = (experimentName, userId) => {
  // Simple deterministic hash-based selection
  if (!userId) return 'control';
  
  const hash = Array.from(experimentName + userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variants = ['control', 'variant_a', 'variant_b'];
  return variants[hash % variants.length];
};

export const isFeatureEnabled = (flagName, user) => {
  if (!user) return false;
  // If user is admin, all features enabled for testing
  if (user.role === 'admin') return true;
  
  // Logic to check user's enabled features (could be fetched from DB)
  return true; 
};
