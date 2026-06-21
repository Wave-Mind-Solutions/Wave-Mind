import { describe, it, expect, vi } from 'vitest';
import { analyzeProjectWithGemini } from '../services/geminiService';
import api from '../services/api';

// Mock the api module
vi.mock('../services/api', () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

describe('Frontend Services & Logic Tests', () => {
  it('analyzeProjectWithGemini should query the backend proxy and return suggestions', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          projectType: 'E-Commerce Mobile App',
          complexityLevel: 'Medium',
          complexityScore: 6,
          techStack: ['React Native', 'Node.js', 'MongoDB'],
          recommendedApproach: 'Sleek React Native app with REST API backend.',
          suggestedBudgetRange: '₹80,000 – ₹1,20,000',
          timeEstimate: '4-6 weeks',
        },
      },
    };

    api.post.mockResolvedValueOnce(mockResponse);

    const result = await analyzeProjectWithGemini({
      title: 'E-Commerce App',
      description: 'Need an online shop for clothes',
      budget: '50000',
      priority: 'Medium',
      techStack: ['React', 'Node.js'],
    });

    expect(api.post).toHaveBeenCalledWith('/ai/analyze-project', {
      title: 'E-Commerce App',
      description: 'Need an online shop for clothes',
      budget: '50000',
      priority: 'Medium',
      techStack: ['React', 'Node.js'],
    });

    expect(result.projectType).toBe('E-Commerce Mobile App');
    expect(result.complexityLevel).toBe('Medium');
    expect(result.suggestedBudgetRange).toBe('₹80,000 – ₹1,20,000');
  });

  it('analyzeProjectWithGemini should handle API errors gracefully', async () => {
    const mockError = {
      response: {
        data: {
          message: 'AI quota exceeded. Try again later.',
        },
      },
    };

    api.post.mockRejectedValueOnce(mockError);

    await expect(
      analyzeProjectWithGemini({
        description: 'Test project description',
      })
    ).rejects.toThrow('AI quota exceeded. Try again later.');
  });
});
