// Features data for the application
import { Shield, Fingerprint, Smartphone, Users, Lock, Zap, Eye, Globe } from 'lucide-react';

export const mainFeatures = [
  {
    id: 'biometric-auth',
    title: 'Multi-Modal Biometric Authentication',
    description: 'Support for fingerprint, facial recognition, voice, and iris scanning with advanced liveness detection.',
    icon: Fingerprint,
    category: 'authentication',
    benefits: [
      'Sub-second authentication',
      'Spoof-resistant technology',
      'Multiple biometric modalities',
      'Adaptive authentication'
    ],
    technical: {
      accuracy: '99.97%',
      speed: '< 500ms',
      falseAcceptRate: '0.001%',
      falseRejectRate: '0.1%'
    }
  },
  {
    id: 'enterprise-security',
    title: 'Enterprise-Grade Security',
    description: 'Military-grade encryption, zero-knowledge architecture, and compliance with global security standards.',
    icon: Shield,
    category: 'security',
    benefits: [
      'AES-256 encryption',
      'Zero-knowledge architecture',
      'SOC 2 Type II compliance',
      'GDPR & CCPA compliant'
    ],
    technical: {
      encryption: 'AES-256-GCM',
      keyManagement: 'HSM-backed',
      compliance: ['SOC 2', 'ISO 27001', 'GDPR'],
      uptime: '99.99%'
    }
  },
  {
    id: 'mobile-first',
    title: 'Mobile-First Design',
    description: 'Native mobile SDKs with seamless integration for iOS, Android, and cross-platform frameworks.',
    icon: Smartphone,
    category: 'integration',
    benefits: [
      'Native iOS & Android SDKs',
      'React Native support',
      'Flutter integration',
      'Progressive Web App ready'
    ],
    technical: {
      platforms: ['iOS', 'Android', 'Web', 'React Native', 'Flutter'],
      minVersions: ['iOS 12+', 'Android 7+'],
      size: '< 2MB',
      performance: 'Hardware accelerated'
    }
  },
  {
    id: 'scalable-infrastructure',
    title: 'Massively Scalable Infrastructure',
    description: 'Cloud-native architecture built to handle millions of authentications with auto-scaling capabilities.',
    icon: Globe,
    category: 'infrastructure',
    benefits: [
      'Global CDN deployment',
      'Auto-scaling capabilities',
      'Load balancing',
      'Disaster recovery'
    ],
    technical: {
      capacity: '10M+ auths/day',
      latency: '< 100ms globally',
      availability: '99.99%',
      regions: '15+ AWS regions'
    }
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Security Analytics',
    description: 'Real-time threat detection, behavioral analysis, and comprehensive security monitoring.',
    icon: Eye,
    category: 'analytics',
    benefits: [
      'Real-time threat detection',
      'Behavioral biometrics',
      'Risk scoring',
      'Fraud prevention'
    ],
    technical: {
      detection: 'ML-powered',
      accuracy: '99.5%',
      latency: '< 50ms',
      falsePositives: '< 0.1%'
    }
  },
  {
    id: 'team-management',
    title: 'Enterprise Team Management',
    description: 'Comprehensive user management, role-based access control, and audit logging for enterprise teams.',
    icon: Users,
    category: 'management',
    benefits: [
      'Role-based access control',
      'Single sign-on (SSO)',
      'Audit logging',
      'Team collaboration'
    ],
    technical: {
      users: 'Unlimited',
      roles: 'Custom roles',
      integrations: ['SAML', 'OAuth', 'LDAP'],
      logging: 'Comprehensive audit trails'
    }
  }
];

export const securityFeatures = [
  {
    id: 'zero-trust',
    title: 'Zero Trust Architecture',
    description: 'Never trust, always verify approach with continuous authentication and authorization.',
    icon: Lock,
    highlights: ['Continuous verification', 'Least privilege access', 'Micro-segmentation']
  },
  {
    id: 'threat-detection',
    title: 'AI-Powered Threat Detection',
    description: 'Machine learning algorithms detect and prevent sophisticated attack patterns.',
    icon: Eye,
    highlights: ['Behavioral analysis', 'Anomaly detection', 'Real-time alerts']
  },
  {
    id: 'instant-auth',
    title: 'Lightning-Fast Authentication',
    description: 'Sub-second authentication with advanced optimization and edge computing.',
    icon: Zap,
    highlights: ['< 500ms response time', 'Edge computing', 'Intelligent caching']
  }
];

export const integrationFeatures = [
  {
    id: 'api-first',
    title: 'API-First Design',
    description: 'RESTful APIs with comprehensive documentation and SDKs for major platforms.',
    platforms: ['JavaScript', 'Python', 'Java', 'Go', 'PHP', 'Ruby'],
    documentation: 'Complete with examples and tutorials'
  },
  {
    id: 'webhook-support',
    title: 'Webhook Integration',
    description: 'Real-time notifications for authentication events and security alerts.',
    events: ['Authentication success/failure', 'User registration', 'Security alerts'],
    reliability: 'Guaranteed delivery with retry logic'
  },
  {
    id: 'sso-integration',
    title: 'Single Sign-On (SSO)',
    description: 'Seamless integration with popular identity providers and enterprise systems.',
    providers: ['Okta', 'Auth0', 'Azure AD', 'Google Workspace', 'SAML', 'OIDC'],
    protocols: ['SAML 2.0', 'OAuth 2.0', 'OpenID Connect']
  }
];

export const complianceFeatures = [
  {
    standard: 'SOC 2 Type II',
    description: 'Audited security controls for availability, processing integrity, confidentiality, and privacy',
    status: 'Certified',
    validUntil: '2025-12-31'
  },
  {
    standard: 'ISO 27001',
    description: 'International standard for information security management systems',
    status: 'Certified',
    validUntil: '2025-09-15'
  },
  {
    standard: 'GDPR',
    description: 'Full compliance with European General Data Protection Regulation',
    status: 'Compliant',
    features: ['Data portability', 'Right to erasure', 'Privacy by design']
  },
  {
    standard: 'CCPA',
    description: 'California Consumer Privacy Act compliance for US users',
    status: 'Compliant',
    features: ['Data transparency', 'Opt-out rights', 'Non-discrimination']
  },
  {
    standard: 'FIDO2/WebAuthn',
    description: 'Open authentication standards for passwordless login',
    status: 'Certified',
    level: 'Level 2 Authenticator'
  }
];

export const technicalSpecs = {
  biometrics: {
    fingerprint: {
      algorithm: 'Minutiae-based matching',
      templateSize: '< 1KB',
      accuracy: '99.97%',
      speed: '< 300ms'
    },
    face: {
      algorithm: '3D facial recognition',
      livenessDetection: 'Active and passive',
      accuracy: '99.95%',
      speed: '< 400ms'
    },
    voice: {
      algorithm: 'Neural voice verification',
      textDependent: true,
      accuracy: '99.8%',
      speed: '< 600ms'
    },
    iris: {
      algorithm: 'Iris pattern matching',
      distance: '10-50cm',
      accuracy: '99.99%',
      speed: '< 200ms'
    }
  },
  security: {
    encryption: {
      inTransit: 'TLS 1.3',
      atRest: 'AES-256-GCM',
      keyManagement: 'AWS KMS',
      hashing: 'SHA-256'
    },
    infrastructure: {
      hosting: 'AWS',
      regions: 15,
      uptime: '99.99%',
      backup: 'Real-time replication'
    }
  },
  performance: {
    api: {
      latency: '< 100ms',
      throughput: '10K req/sec',
      availability: '99.99%'
    },
    biometric: {
      enrollment: '< 5 seconds',
      verification: '< 500ms',
      templateGeneration: '< 1 second'
    }
  }
};

export const useCases = [
  {
    id: 'financial-services',
    title: 'Financial Services',
    description: 'Secure banking and financial transactions with regulatory compliance.',
    industries: ['Banking', 'Insurance', 'Investment', 'Fintech'],
    benefits: [
      'Fraud reduction by 95%',
      'Regulatory compliance',
      'Enhanced customer trust',
      'Faster onboarding'
    ],
    challenges: [
      'Identity verification',
      'Account takeover prevention',
      'Regulatory compliance',
      'Customer experience'
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'HIPAA-compliant authentication for healthcare systems and patient data.',
    industries: ['Hospitals', 'Clinics', 'Telemedicine', 'Health Tech'],
    benefits: [
      'HIPAA compliance',
      'Patient data security',
      'Staff efficiency',
      'Audit trails'
    ],
    challenges: [
      'Patient privacy',
      'Shared devices',
      'Emergency access',
      'Compliance reporting'
    ]
  },
  {
    id: 'enterprise',
    title: 'Enterprise Security',
    description: 'Workforce authentication and access management for large organizations.',
    industries: ['Technology', 'Manufacturing', 'Retail', 'Government'],
    benefits: [
      'Zero trust security',
      'Single sign-on',
      'Reduced IT costs',
      'Improved productivity'
    ],
    challenges: [
      'Identity management',
      'Device security',
      'Remote work',
      'Legacy systems'
    ]
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Secure access to educational resources and student information systems.',
    industries: ['K-12 Schools', 'Universities', 'EdTech', 'Training'],
    benefits: [
      'FERPA compliance',
      'Student safety',
      'Easy deployment',
      'Cost effective'
    ],
    challenges: [
      'Student privacy',
      'Shared devices',
      'Age verification',
      'Accessibility'
    ]
  }
];

export const roadmapFeatures = [
  {
    quarter: 'Q3 2025',
    features: [
      'Advanced behavioral biometrics',
      'Multi-device synchronization',
      'Enhanced mobile SDKs',
      'Real-time risk scoring'
    ],
    status: 'in-development'
  },
  {
    quarter: 'Q4 2025',
    features: [
      'Quantum-resistant encryption',
      'Advanced AI threat detection',
      'Passwordless enterprise SSO',
      'Global compliance certifications'
    ],
    status: 'planned'
  },
  {
    quarter: 'Q1 2026',
    features: [
      'Decentralized identity support',
      'Blockchain integration',
      'Advanced analytics dashboard',
      'IoT device authentication'
    ],
    status: 'research'
  }
];