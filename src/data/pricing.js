// Pricing plans and features data
export const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for small projects and testing',
      price: 0,
      period: 'month',
      yearlyPrice: 0,
      yearlyDiscount: 0,
      popular: false,
      features: [
        { name: 'Up to 1,000 authentications/month', included: true },
        { name: 'Basic biometric authentication', included: true },
        { name: 'Email support', included: true },
        { name: 'Standard security features', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false },
        { name: 'SSO integration', included: false },
        { name: 'Advanced threat detection', included: false }
      ],
      limits: {
        authentications: 1000,
        users: 100,
        apiCalls: 10000,
        storage: '1GB',
        support: 'Email only'
      },
      cta: 'Start Free',
      highlighted: false
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Great for growing businesses and startups',
      price: 29,
      period: 'month',
      yearlyPrice: 290,
      yearlyDiscount: 17,
      popular: false,
      features: [
        { name: 'Up to 25,000 authentications/month', included: true },
        { name: 'Multi-modal biometric authentication', included: true },
        { name: 'Email & chat support', included: true },
        { name: 'Advanced security features', included: true },
        { name: 'API access with higher limits', included: true },
        { name: 'Basic analytics dashboard', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Priority support', included: false },
        { name: 'SSO integration', included: false },
        { name: 'Advanced threat detection', included: false }
      ],
      limits: {
        authentications: 25000,
        users: 1000,
        apiCalls: 100000,
        storage: '10GB',
        support: 'Email & chat'
      },
      cta: 'Start 14-day Trial',
      highlighted: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Perfect for medium to large businesses',
      price: 99,
      period: 'month',
      yearlyPrice: 990,
      yearlyDiscount: 17,
      popular: true,
      features: [
        { name: 'Up to 100,000 authentications/month', included: true },
        { name: 'Full biometric suite + behavioral analytics', included: true },
        { name: 'Priority support (24/7)', included: true },
        { name: 'Enterprise security features', included: true },
        { name: 'Unlimited API access', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'Full custom branding', included: true },
        { name: 'SSO integration', included: true },
        { name: 'Advanced threat detection', included: true },
        { name: 'Compliance reporting', included: true }
      ],
      limits: {
        authentications: 100000,
        users: 10000,
        apiCalls: 'Unlimited',
        storage: '100GB',
        support: '24/7 priority'
      },
      cta: 'Start 14-day Trial',
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: 'Custom',
      period: 'month',
      yearlyPrice: 'Custom',
      yearlyDiscount: 0,
      popular: false,
      features: [
        { name: 'Unlimited authentications', included: true },
        { name: 'Custom biometric solutions', included: true },
        { name: 'Dedicated support team', included: true },
        { name: 'Military-grade security', included: true },
        { name: 'Custom API solutions', included: true },
        { name: 'Custom analytics & BI integration', included: true },
        { name: 'White-label solutions', included: true },
        { name: 'Enterprise SSO & directory integration', included: true },
        { name: 'AI-powered threat intelligence', included: true },
        { name: 'Custom compliance & audit support', included: true }
      ],
      limits: {
        authentications: 'Unlimited',
        users: 'Unlimited',
        apiCalls: 'Unlimited',
        storage: 'Custom',
        support: 'Dedicated team'
      },
      cta: 'Contact Sales',
      highlighted: false
    }
  ];
  
  export const addons = [
    {
      id: 'extra-authentications',
      name: 'Additional Authentications',
      description: 'Extra authentications beyond your plan limit',
      pricing: [
        { tier: 'free', price: 0.01, unit: 'per authentication' },
        { tier: 'starter', price: 0.008, unit: 'per authentication' },
        { tier: 'professional', price: 0.005, unit: 'per authentication' }
      ]
    },
    {
      id: 'premium-support',
      name: 'Premium Support',
      description: '24/7 phone support with 1-hour response time',
      pricing: [
        { tier: 'free', price: 99, unit: 'per month' },
        { tier: 'starter', price: 49, unit: 'per month' },
        { tier: 'professional', price: 'Included', unit: '' }
      ]
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Deep insights, custom reports, and BI integration',
      pricing: [
        { tier: 'free', price: 29, unit: 'per month' },
        { tier: 'starter', price: 19, unit: 'per month' },
        { tier: 'professional', price: 'Included', unit: '' }
      ]
    },
    {
      id: 'compliance-package',
      name: 'Compliance Package',
      description: 'HIPAA, SOX, PCI DSS compliance features and reporting',
      pricing: [
        { tier: 'free', price: 199, unit: 'per month' },
        { tier: 'starter', price: 149, unit: 'per month' },
        { tier: 'professional', price: 99, unit: 'per month' }
      ]
    }
  ];
  
  export const featureComparison = [
    {
      category: 'Authentication',
      features: [
        {
          name: 'Monthly Authentications',
          free: '1,000',
          starter: '25,000',
          professional: '100,000',
          enterprise: 'Unlimited'
        },
        {
          name: 'Biometric Modalities',
          free: 'Fingerprint only',
          starter: 'Fingerprint + Face',
          professional: 'All modalities',
          enterprise: 'All + Custom'
        },
        {
          name: 'Liveness Detection',
          free: 'Basic',
          starter: 'Advanced',
          professional: 'Advanced',
          enterprise: 'Military-grade'
        },
        {
          name: 'Multi-factor Authentication',
          free: true,
          starter: true,
          professional: true,
          enterprise: true
        }
      ]
    },
    {
      category: 'Security',
      features: [
        {
          name: 'Encryption',
          free: 'AES-256',
          starter: 'AES-256',
          professional: 'AES-256 + HSM',
          enterprise: 'Quantum-resistant'
        },
        {
          name: 'Threat Detection',
          free: 'Basic',
          starter: 'Standard',
          professional: 'Advanced AI',
          enterprise: 'Custom AI models'
        },
        {
          name: 'Audit Logging',
          free: '30 days',
          starter: '90 days',
          professional: '1 year',
          enterprise: 'Custom retention'
        },
        {
          name: 'Compliance',
          free: 'Basic',
          starter: 'GDPR, CCPA',
          professional: 'All standards',
          enterprise: 'Custom compliance'
        }
      ]
    },
    {
      category: 'Integration',
      features: [
        {
          name: 'API Rate Limits',
          free: '10K/month',
          starter: '100K/month',
          professional: 'Unlimited',
          enterprise: 'Unlimited'
        },
        {
          name: 'SDKs',
          free: 'JavaScript',
          starter: 'JS, iOS, Android',
          professional: 'All platforms',
          enterprise: 'Custom SDKs'
        },
        {
          name: 'Webhooks',
          free: '5 endpoints',
          starter: '25 endpoints',
          professional: 'Unlimited',
          enterprise: 'Unlimited'
        },
        {
          name: 'SSO Integration',
          free: false,
          starter: false,
          professional: true,
          enterprise: true
        }
      ]
    },
    {
      category: 'Support',
      features: [
        {
          name: 'Support Channels',
          free: 'Email',
          starter: 'Email + Chat',
          professional: '24/7 All channels',
          enterprise: 'Dedicated team'
        },
        {
          name: 'Response Time',
          free: '48 hours',
          starter: '24 hours',
          professional: '4 hours',
          enterprise: '1 hour'
        },
        {
          name: 'Phone Support',
          free: false,
          starter: false,
          professional: true,
          enterprise: true
        },
        {
          name: 'Technical Account Manager',
          free: false,
          starter: false,
          professional: false,
          enterprise: true
        }
      ]
    }
  ];
  
  export const usageCalculator = {
    tiers: [
      { min: 0, max: 1000, price: 0, plan: 'free' },
      { min: 1001, max: 25000, price: 0.002, plan: 'starter' },
      { min: 25001, max: 100000, price: 0.0015, plan: 'professional' },
      { min: 100001, max: 1000000, price: 0.001, plan: 'enterprise' },
      { min: 1000001, max: Infinity, price: 0.0005, plan: 'enterprise' }
    ],
    
    calculate: (authentications) => {
      if (authentications <= 1000) {
        return { plan: 'free', cost: 0, recommended: 'Free' };
      } else if (authentications <= 25000) {
        return { plan: 'starter', cost: 29, recommended: 'Starter' };
      } else if (authentications <= 100000) {
        return { plan: 'professional', cost: 99, recommended: 'Professional' };
      } else {
        return { plan: 'enterprise', cost: 'Custom', recommended: 'Enterprise' };
      }
    }
  };
  
  export const industryPricing = {
    'financial-services': {
      discount: 0,
      compliance: ['SOX', 'PCI DSS', 'GDPR'],
      additionalCosts: {
        'compliance-package': 'Required',
        'premium-support': 'Recommended'
      }
    },
    'healthcare': {
      discount: 10,
      compliance: ['HIPAA', 'HITECH', 'GDPR'],
      additionalCosts: {
        'compliance-package': 'Required',
        'audit-logging': 'Extended retention required'
      }
    },
    'education': {
      discount: 25,
      compliance: ['FERPA', 'COPPA'],
      additionalCosts: {
        'student-verification': 'Age verification features'
      }
    },
    'government': {
      discount: 15,
      compliance: ['FedRAMP', 'FISMA', 'CJIS'],
      additionalCosts: {
        'government-cloud': 'Dedicated government cloud'
      }
    },
    'startup': {
      discount: 50,
      conditions: 'Less than 50 employees, Series A or earlier',
      additionalCosts: {}
    }
  };
  
  export const roi_calculator = {
    currentCosts: {
      'password-resets': { cost: 25, frequency: 'per reset' },
      'fraud-losses': { cost: 50000, frequency: 'per incident' },
      'compliance-audits': { cost: 150000, frequency: 'per year' },
      'support-tickets': { cost: 15, frequency: 'per ticket' },
      'downtime': { cost: 10000, frequency: 'per hour' }
    },
    
    improvements: {
      'password-reset-reduction': 90, // 90% reduction
      'fraud-prevention': 95, // 95% reduction
      'audit-efficiency': 75, // 75% time savings
      'support-reduction': 60, // 60% fewer tickets
      'uptime-improvement': 99.99 // 99.99% uptime
    },
    
    calculate: (userInputs) => {
      const currentAnnualCost = Object.entries(userInputs.current).reduce((total, [key, value]) => {
        return total + (value * 12); // Assuming monthly values
      }, 0);
      
      const potentialSavings = Object.entries(userInputs.current).reduce((total, [key, value]) => {
        const improvementRate = roi_calculator.improvements[key] || 0;
        return total + (value * 12 * (improvementRate / 100));
      }, 0);
      
      const secureAuthCost = userInputs.plan === 'professional' ? 1188 : userInputs.plan === 'starter' ? 348 : 0;
      const netSavings = potentialSavings - secureAuthCost;
      const roi = secureAuthCost > 0 ? (netSavings / secureAuthCost) * 100 : 0;
      
      return {
        currentAnnualCost,
        potentialSavings,
        secureAuthCost,
        netSavings,
        roi,
        paybackPeriod: secureAuthCost > 0 ? (secureAuthCost / (netSavings / 12)) : 0
      };
    }
  };
  
  export const testimonialsPricing = [
    {
      quote: 'SecureAuth Pro paid for itself in the first quarter through fraud reduction alone.',
      author: 'Sarah Chen, CISO at TechCorp Financial',
      savings: '$2.4M annually'
    },
    {
      quote: 'The compliance features saved us over 200 hours of audit preparation.',
      author: 'Michael Rodriguez, VP Engineering at HealthTech',
      savings: '75% audit time reduction'
    },
    {
      quote: 'Our IT support tickets dropped by 60% after implementing passwordless authentication.',
      author: 'Emily Watson, Head of Security at Global Manufacturing',
      savings: '$180K annually in support costs'
    }
  ];
  
  export const frequentlyAskedQuestions = [
    {
      question: 'How does pricing scale with usage?',
      answer: 'Our pricing is designed to grow with your business. Each plan includes a generous allocation of authentications, and we offer transparent overage pricing if you exceed your limit.'
    },
    {
      question: 'Are there any setup fees or hidden costs?',
      answer: 'No setup fees, no hidden costs. What you see is what you pay. All plans include standard integrations and basic support.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
    },
    {
      question: 'Do you offer discounts for annual payments?',
      answer: 'Yes, all paid plans receive a 17% discount when billed annually. Enterprise customers can discuss custom billing arrangements.'
    },
    {
      question: 'What happens if I exceed my authentication limit?',
      answer: 'We\'ll notify you as you approach your limit. Overages are billed at transparent rates, or you can upgrade to a higher plan for better value.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start. The Free plan is available indefinitely for small projects.'
    }
  ];
  
  export const getTotalMonthlyCost = (plan, addons = []) => {
    const basePlan = pricingPlans.find(p => p.id === plan);
    if (!basePlan) return 0;
    
    const baseCost = typeof basePlan.price === 'number' ? basePlan.price : 0;
    const addonsCost = addons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        const pricing = addon.pricing.find(p => p.tier === plan);
        if (pricing && typeof pricing.price === 'number') {
          return total + pricing.price;
        }
      }
      return total;
    }, 0);
    
    return baseCost + addonsCost;
  };
  
  export const getRecommendedPlan = (requirements) => {
    const { authentications, users, industry, compliance } = requirements;
    
    if (authentications <= 1000 && users <= 100) {
      return 'free';
    } else if (authentications <= 25000 && users <= 1000) {
      return 'starter';
    } else if (authentications <= 100000 && users <= 10000) {
      return 'professional';
    } else {
      return 'enterprise';
    }
  };