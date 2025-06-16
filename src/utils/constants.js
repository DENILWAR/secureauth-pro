// Application constants and configuration
export const APP_CONFIG = {
    name: 'SecureAuth Pro',
    version: '2.0.0',
    description: 'Enterprise-grade biometric authentication platform',
    url: 'https://secureauth-pro.com',
    support: {
      email: 'support@secureauth-pro.com',
      phone: '+1 (555) 123-4567'
    },
    social: {
      twitter: '@SecureAuthPro',
      linkedin: 'secureauth-pro',
      github: 'secureauth-pro'
    }
  };
  
  export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'https://api.secureauth-pro.com/v1',
    timeout: 30000,
    retries: 3,
    endpoints: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        refresh: '/auth/refresh',
        verify: '/auth/verify',
        forgot: '/auth/forgot-password',
        reset: '/auth/reset-password',
        twoFactor: '/auth/2fa'
      },
      biometric: {
        register: '/biometric/register',
        verify: '/biometric/verify',
        delete: '/biometric/delete'
      },
      user: {
        profile: '/user/profile',
        settings: '/user/settings',
        activity: '/user/activity'
      },
      security: {
        alerts: '/security/alerts',
        logs: '/security/logs',
        devices: '/security/devices'
      }
    }
  };
  
  export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
    security: '/security',
    features: '/features',
    pricing: '/pricing',
    about: '/about',
    contact: '/contact',
    support: '/support',
    documentation: '/docs',
    notFound: '/404'
  };
  
  export const AUTH_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    ERROR: 'error'
  };
  
  export const BIOMETRIC_TYPES = {
    FINGERPRINT: 'fingerprint',
    FACE_ID: 'face-id',
    VOICE: 'voice',
    IRIS: 'iris',
    PALM: 'palm'
  };
  
  export const SECURITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };
  
  export const ALERT_TYPES = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
  };
  
  export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  };
  
  export const DEVICE_TYPES = {
    DESKTOP: 'desktop',
    TABLET: 'tablet',
    MOBILE: 'mobile'
  };
  
  export const SUBSCRIPTION_PLANS = {
    FREE: 'free',
    STARTER: 'starter',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise'
  };
  
  export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  };
  
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1
  };
  
  export const FILE_CONSTRAINTS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword']
  };
  
  export const VALIDATION_CONSTRAINTS = {
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    username: {
      minLength: 3,
      maxLength: 30,
      allowedChars: /^[a-zA-Z0-9_-]+$/
    },
    name: {
      minLength: 2,
      maxLength: 50
    },
    email: {
      maxLength: 254
    }
  };
  
  export const SESSION_CONFIG = {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    USER_KEY: 'user_data',
    THEME_KEY: 'theme_preference',
    LANGUAGE_KEY: 'language_preference',
    EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 5 * 60 * 1000 // 5 minutes
  };
  
  export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  };
  
  export const BREAKPOINTS = {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  };
  
  export const Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080
  };
  
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  };
  
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_EXISTS: 'An account with this email already exists.',
    BIOMETRIC_NOT_SUPPORTED: 'Biometric authentication is not supported on this device.',
    BIOMETRIC_NOT_ENROLLED: 'No biometric data found. Please set up biometric authentication.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
  };
  
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    LOGOUT_SUCCESS: 'Successfully logged out!',
    REGISTRATION_SUCCESS: 'Account created successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
    BIOMETRIC_REGISTERED: 'Biometric authentication set up successfully!',
    EMAIL_SENT: 'Email sent successfully!'
  };
  
  export const FEATURE_FLAGS = {
    BIOMETRIC_AUTH: true,
    TWO_FACTOR_AUTH: true,
    SOCIAL_LOGIN: true,
    DARK_MODE: true,
    ANALYTICS: true,
    BETA_FEATURES: false
  };
  
  export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
    USERNAME: /^[a-zA-Z0-9_-]+$/,
    URL: /^https?:\/\/.+/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/
  };
  
  export const DEFAULT_PREFERENCES = {
    theme: THEME_MODES.SYSTEM,
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactor: false,
      biometric: false,
      sessionTimeout: 30 // minutes
    }
  };