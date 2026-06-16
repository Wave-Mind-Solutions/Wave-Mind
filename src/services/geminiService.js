/**
 * WaveMind Solutions – Google Gemini AI Service
 * Powers the AI Project Estimator on the Submit Requirement page
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyzes a project description using Gemini and returns structured estimates.
 * @param {Object} params
 * @param {string} params.description - Project description text
 * @param {string} params.title       - Project title
 * @param {string} params.budget      - Client's stated budget (INR)
 * @param {string} params.priority    - Priority level
 * @param {string[]} params.techStack - Technologies client mentioned
 * @returns {Promise<ProjectAnalysis>}
 */
export async function analyzeProjectWithGemini({ description, title, budget, priority, techStack }) {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set in your .env file.');
  }

  const prompt = `
You are an expert software architect and project estimator at WaveMind Solutions, a premium software agency.

A client has submitted the following project for analysis:

**Project Title:** ${title || 'Not specified'}
**Project Description:** ${description}
**Client's Budget:** ${budget ? `₹${Number(budget).toLocaleString('en-IN')}` : 'Not specified'}
**Priority Level:** ${priority || 'Medium'}
**Tech Preferences:** ${techStack?.length ? techStack.join(', ') : 'None specified'}

Analyze this project thoroughly and respond ONLY with a valid JSON object (no markdown, no code blocks, no explanation outside JSON) in exactly this structure:

{
  "projectType": "string (e.g. Web Application, Mobile App, AI Platform, E-Commerce, SaaS, etc.)",
  "complexityLevel": "string (Low / Medium / Medium-High / High / Enterprise)",
  "complexityScore": number (1-10),
  "techStack": ["array", "of", "recommended", "technologies", "max 7 items"],
  "recommendedApproach": "string (1-2 sentences about architecture approach)",
  "suggestedBudgetRange": "string (e.g. ₹80,000 – ₹1,20,000)",
  "budgetFeedback": "string (brief comment on how client's budget compares to estimate, or 'Not specified' if no budget)",
  "timeEstimate": "string (e.g. 6–8 weeks)",
  "teamRequired": ["array", "of", "roles", "needed", "e.g. React Developer, UI Designer"],
  "coreFeatures": ["array", "of", "3-5", "essential", "features", "for", "MVP"],
  "riskFactors": ["array", "of", "2-4", "key", "risks"],
  "optimizationTips": ["array", "of", "2-3", "performance", "or", "cost", "tips"],
  "aiOpportunities": ["array", "of", "1-3", "AI", "features", "that", "could", "enhance", "this", "project"],
  "successScore": number (1-10, overall viability),
  "recommendation": "string (1-2 sentence final recommendation and immediate next step)"
}

Be specific, practical, and tailored to the Indian market context. Use Indian Rupee (₹) for all monetary values.
`;

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip any accidental markdown code fences
  const cleaned = rawText.replace(/```json|```/gi, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
}
