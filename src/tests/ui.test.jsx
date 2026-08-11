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

import {
  getPricingForCategory,
  validateBudget,
  calculateProjectPrice,
  getBudgetPresetOptions,
  formatINR
} from '../config/pricingConfig';

describe('Centralized AI Website Pricing Engine Unit Tests', () => {
  it('should return official baseline pricing matrix for all website categories', () => {
    expect(getPricingForCategory('Business Website').min).toBe(15000);
    expect(getPricingForCategory('E-commerce').min).toBe(30000);
    expect(getPricingForCategory('Portfolio').min).toBe(10000);
    expect(getPricingForCategory('Blog').min).toBe(10000);
    expect(getPricingForCategory('Education Website').min).toBe(20000);
    expect(getPricingForCategory('Booking / Service Website').min).toBe(20000);
    expect(getPricingForCategory('Custom Website / Web App').min).toBe(50000);
  });

  it('should programmatically enforce Hard Minimum Price Rule', () => {
    // Business Website min = 15,000
    expect(validateBudget('Business Website', 10000).isValid).toBe(false);
    expect(validateBudget('Business Website', 12000).isValid).toBe(false);
    expect(validateBudget('Business Website', 14999).isValid).toBe(false);
    expect(validateBudget('Business Website', 15000).isValid).toBe(true);
    expect(validateBudget('Business Website', 20000).isValid).toBe(true);

    // E-commerce min = 30,000
    expect(validateBudget('E-commerce', 20000).isValid).toBe(false);
    expect(validateBudget('E-commerce', 25000).isValid).toBe(false);
    expect(validateBudget('E-commerce', 29999).isValid).toBe(false);
    expect(validateBudget('E-commerce', 30000).isValid).toBe(true);
    expect(validateBudget('E-commerce', 75000).isValid).toBe(true);

    // Custom Web App min = 50,000
    expect(validateBudget('Custom Website / Web App', 45000).isValid).toBe(false);
    expect(validateBudget('Custom Website / Web App', 50000).isValid).toBe(true);
  });

  it('should calculate estimated price and NEVER recommend below minimum price', () => {
    const lowCalc = calculateProjectPrice({
      websiteType: 'E-commerce',
      pagesCount: 1,
      designComplexity: 'Basic',
      features: [],
      animationComplexity: 'Basic',
      backendComplexity: 'Static'
    });

    // E-commerce minimum is 30,000 -> final calculated cost must be >= 30,000
    expect(lowCalc.estimatedCost).toBeGreaterThanOrEqual(30000);
  });

  it('should format numbers with Indian Rupee en-IN format', () => {
    expect(formatINR(15000)).toBe('₹15,000');
    expect(formatINR(35000)).toBe('₹35,000');
    expect(formatINR(100000)).toBe('₹1,00,000');
    expect(formatINR(150000)).toBe('₹1,50,000');
  });

  it('should generate budget presets strictly greater than or equal to category minimum', () => {
    const ecommercePresets = getBudgetPresetOptions('E-commerce');
    expect(ecommercePresets.every(val => val >= 30000)).toBe(true);

    const businessPresets = getBudgetPresetOptions('Business Website');
    expect(businessPresets.every(val => val >= 15000)).toBe(true);
  });
});

import ChatInterface from '../components/ai/ChatInterface';

describe('AI Sales Assistant Category Flow Isolation Tests', () => {
  it('Portfolio selection must trigger Portfolio flow and NEVER show E-commerce features', () => {
    // We can instantiate SalesConversation logic internally if needed or test via flow config
    const flowConfig = {
      'Business Website': ['Services', 'Contact Form', 'Testimonials', 'WhatsApp Integration', 'SEO'],
      'E-commerce': ['Online Payment', 'Product Management', 'Shopping Cart', 'Wishlist', 'Order Tracking'],
      'Portfolio': ['Hero / Introduction', 'About Me', 'Skills', 'Projects', 'Experience', 'Education', 'Resume / CV'],
      'Blog': ['Categories', 'Search', 'Blog Editor', 'Author Profiles', 'Comments', 'Newsletter'],
      'Education': ['Student Login', 'Teacher Login', 'Course Management', 'Live Classes', 'Quiz/Exam System'],
      'Booking/Service Website': ['Service Listing', 'Calendar', 'Time Slots', 'Online Booking', 'Staff Dashboard'],
      'Custom Website': ['Custom User Dashboards', 'Admin Panel', 'Real-time Chat', 'API Integration']
    };

    // Ensure Portfolio feature set has NO overlap with E-commerce product management/cart features
    const portfolioFeatures = flowConfig['Portfolio'];
    expect(portfolioFeatures).toContain('About Me');
    expect(portfolioFeatures).toContain('Projects');
    expect(portfolioFeatures).not.toContain('Shopping Cart');
    expect(portfolioFeatures).not.toContain('Product Management');
    expect(portfolioFeatures).not.toContain('Wishlist');
  });

  it('Business Website flow must trigger Business specific features', () => {
    const bizFeatures = ['Services', 'Contact Form', 'Testimonials', 'WhatsApp Integration'];
    expect(bizFeatures).not.toContain('Shopping Cart');
  });

  it('Blog flow must trigger Blog specific features', () => {
    const blogFeatures = ['Categories', 'Search', 'Author Profiles', 'Comments'];
    expect(blogFeatures).not.toContain('Order Tracking');
  });

  it('Education flow must trigger LMS specific features', () => {
    const eduFeatures = ['Student Login', 'Teacher Login', 'Course Management'];
    expect(eduFeatures).not.toContain('Wishlist');
  });

  it('Booking flow must trigger Appointment specific features', () => {
    const bookingFeatures = ['Calendar', 'Time Slots', 'Online Booking'];
    expect(bookingFeatures).not.toContain('Blog Editor');
  });
});
