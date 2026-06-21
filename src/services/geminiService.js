/**
 * WaveMind Solutions – Google Gemini AI Service
 * Refactored to query the secure backend proxy endpoint
 */
import api from './api';

/**
 * Analyzes a project description using Gemini via backend proxy and returns structured estimates.
 * @param {Object} params
 * @param {string} params.description - Project description text
 * @param {string} params.title       - Project title
 * @param {string} params.budget      - Client's stated budget (INR)
 * @param {string} params.priority    - Priority level
 * @param {string[]} params.techStack - Technologies client mentioned
 * @returns {Promise<Object>}
 */
export async function analyzeProjectWithGemini({ description, title, budget, priority, techStack }) {
  try {
    const res = await api.post('/ai/analyze-project', {
      title,
      description,
      budget,
      priority,
      techStack,
    });
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to complete AI analysis. Please try again.');
  }
}
