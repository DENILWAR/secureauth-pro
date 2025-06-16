// Security utilities and encryption helpers
import { SECURITY_LEVELS } from './constants.js';

// Encryption utilities (for demonstration - use proper backend encryption in production)
export const encryptData = async (data, key) => {
  try {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedData
    );
    
    return {
      data: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = async (encryptedData, key) => {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      cryptoKey,
      new Uint8Array(encryptedData.data)
    );
    
    return JSON.parse(decoder.decode(decrypted));
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Hash generation
export const generateHash = async (data) => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to generate hash');
  }
};

// Secure random generation
export const generateSecureRandom = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const generateSecureRandomString = (length = 32, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => charset[byte % charset.length]).join('');
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeHtml = (html) => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

export const stripHtml = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

// XSS Protection
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Block suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /about:/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(url));
  } catch (error) {
    return false;
  }
};

// Content Security Policy helpers
export const createCSPNonce = () => {
  return generateSecureRandomString(16);
};

export const validateCSPNonce = (nonce, expectedNonce) => {
  return nonce === expectedNonce;
};

// Rate limiting
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(identifier, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }
    
    const userRequests = this.requests.get(identifier);
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(identifier) {
    if (!this.requests.has(identifier)) {
      return 0;
    }
    
    const userRequests = this.requests.get(identifier);
    if (userRequests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...userRequests);
    return oldestRequest + this.windowMs;
  }
}

// Security level assessment
export const assessSecurityLevel = (factors) => {
  let score = 0;
  const maxScore = Object.keys(factors).length * 3;
  
  Object.entries(factors).forEach(([key, value]) => {
    switch (key) {
      case 'passwordStrength':
        score += value === 'strong' ? 3 : value === 'medium' ? 2 : 1;
        break;
      case 'twoFactorEnabled':
        score += value ? 3 : 0;
        break;
      case 'biometricEnabled':
        score += value ? 3 : 0;
        break;
      case 'deviceTrusted':
        score += value ? 2 : 0;
        break;
      case 'recentActivity':
        score += value ? 1 : 3;
        break;
      default:
        score += value ? 2 : 0;
    }
  });
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return SECURITY_LEVELS.HIGH;
  if (percentage >= 60) return SECURITY_LEVELS.MEDIUM;
  if (percentage >= 40) return SECURITY_LEVELS.LOW;
  return SECURITY_LEVELS.CRITICAL;
};

// Audit logging
export class SecurityAuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      ip: null, // Would be filled by backend
      sessionId: this.getSessionId()
    };
    
    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Store in localStorage for demonstration
    try {
      localStorage.setItem('security_logs', JSON.stringify(this.logs.slice(0, 100)));
    } catch (error) {
      console.error('Failed to store security logs:', error);
    }
    
    return logEntry;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = generateSecureRandomString(32);
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }

  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];
    
    if (filters.event) {
      filteredLogs = filteredLogs.filter(log => log.event === filters.event);
    }
    
    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }
    
    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('security_logs');
  }
}

// Create global audit logger instance
export const auditLogger = new SecurityAuditLogger();

// Security event types
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  TWO_FACTOR_ENABLED: 'two_factor_enabled',
  TWO_FACTOR_DISABLED: 'two_factor_disabled',
  BIOMETRIC_ENROLLED: 'biometric_enrolled',
  BIOMETRIC_REMOVED: 'biometric_removed',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ACCOUNT_LOCKED: 'account_locked',
  SESSION_EXPIRED: 'session_expired',
  DEVICE_REGISTERED: 'device_registered',
  DEVICE_REMOVED: 'device_removed'
};

// Threat detection
export const detectThreats = (userActivity) => {
  const threats = [];
  
  // Multiple failed login attempts
  const recentFailures = userActivity.filter(
    activity => activity.type === 'login_failure' && 
    Date.now() - new Date(activity.timestamp).getTime() < 15 * 60 * 1000 // 15 minutes
  );
  
  if (recentFailures.length >= 3) {
    threats.push({
      type: 'brute_force',
      severity: 'high',
      description: 'Multiple failed login attempts detected',
      count: recentFailures.length
    });
  }
  
  // Unusual login location (would require geolocation data)
  // Unusual login time (would require historical data)
  // Multiple simultaneous sessions
  
  return threats;
};

// Security recommendations
export const generateSecurityRecommendations = (securityState) => {
  const recommendations = [];
  
  if (!securityState.twoFactorEnabled) {
    recommendations.push({
      type: 'two_factor',
      priority: 'high',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      action: 'enable_2fa'
    });
  }
  
  if (!securityState.biometricEnabled && securityState.biometricSupported) {
    recommendations.push({
      type: 'biometric',
      priority: 'medium',
      title: 'Set up Biometric Authentication',
      description: 'Use your fingerprint or face ID for secure, convenient access',
      action: 'setup_biometric'
    });
  }
  
  if (securityState.passwordStrength !== 'strong') {
    recommendations.push({
      type: 'password',
      priority: 'high',
      title: 'Improve Password Strength',
      description: 'Use a stronger password with mixed characters',
      action: 'change_password'
    });
  }
  
  if (securityState.untrustedDevices > 0) {
    recommendations.push({
      type: 'devices',
      priority: 'medium',
      title: 'Review Connected Devices',
      description: `You have ${securityState.untrustedDevices} unrecognized devices`,
      action: 'review_devices'
    });
  }
  
  if (securityState.lastPasswordChange > 90) { // days
    recommendations.push({
      type: 'password_age',
      priority: 'low',
      title: 'Consider Updating Password',
      description: 'Your password is over 3 months old',
      action: 'change_password'
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Secure data validation
export const validateSecureData = (data, schema) => {
  const errors = [];
  
  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      return;
    }
    
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must be no more than ${rules.maxLength} characters`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }
    
    if (rules.sanitize && typeof value === 'string') {
      data[field] = sanitizeInput(value);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: data
  };
};

// Session security
export const generateSessionFingerprint = async () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown'
  ];
  
  return await generateHash(components.join('|'));
};

export const validateSessionFingerprint = async (storedFingerprint) => {
  const currentFingerprint = await generateSessionFingerprint();
  return currentFingerprint === storedFingerprint;
};

// Security headers validation (for when running in secure context)
export const validateSecurityHeaders = (headers = {}) => {
  const requiredHeaders = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Content-Security-Policy'
  ];
  
  const missing = requiredHeaders.filter(header => !headers[header]);
  const warnings = [];
  
  if (missing.length > 0) {
    warnings.push(`Missing security headers: ${missing.join(', ')}`);
  }
  
  if (headers['X-Frame-Options'] !== 'DENY' && headers['X-Frame-Options'] !== 'SAMEORIGIN') {
    warnings.push('X-Frame-Options should be DENY or SAMEORIGIN');
  }
  
  if (headers['X-Content-Type-Options'] !== 'nosniff') {
    warnings.push('X-Content-Type-Options should be nosniff');
  }
  
  return {
    isSecure: warnings.length === 0,
    warnings,
    score: Math.max(0, 100 - (warnings.length * 20))
  };
};

// Privacy utilities
export const anonymizeData = (data, fields = []) => {
  const anonymized = { ...data };
  
  fields.forEach(field => {
    if (anonymized[field]) {
      if (typeof anonymized[field] === 'string') {
        if (field.includes('email')) {
          const [local, domain] = anonymized[field].split('@');
          anonymized[field] = `${local.charAt(0)}***@${domain}`;
        } else if (field.includes('phone')) {
          anonymized[field] = anonymized[field].replace(/\d(?=\d{4})/g, '*');
        } else {
          anonymized[field] = '*'.repeat(anonymized[field].length);
        }
      }
    }
  });
  
  return anonymized;
};

export const maskSensitiveData = (text, patterns = {}) => {
  let masked = text;
  
  const defaultPatterns = {
    email: /[\w.-]+@[\w.-]+\.\w+/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
  };
  
  const allPatterns = { ...defaultPatterns, ...patterns };
  
  Object.entries(allPatterns).forEach(([type, pattern]) => {
    masked = masked.replace(pattern, match => '*'.repeat(match.length));
  });
  
  return masked;
};

// Create default rate limiters
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute
export const passwordResetLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

// Security constants
export const SECURITY_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  AUDIT_LOG_RETENTION: 90, // days
  MAX_CONCURRENT_SESSIONS: 3
};

// Initialize security monitoring
export const initializeSecurity = () => {
  // Monitor for suspicious activity
  let mouseMovements = 0;
  let keystrokes = 0;
  let lastActivity = Date.now();
  
  const trackActivity = () => {
    lastActivity = Date.now();
  };
  
  document.addEventListener('mousemove', () => {
    mouseMovements++;
    trackActivity();
  });
  
  document.addEventListener('keydown', () => {
    keystrokes++;
    trackActivity();
  });
  
  // Check for session timeout
  setInterval(() => {
    const inactiveTime = Date.now() - lastActivity;
    if (inactiveTime > SECURITY_CONSTANTS.SESSION_TIMEOUT) {
      auditLogger.log(SECURITY_EVENTS.SESSION_EXPIRED, {
        inactiveTime,
        lastActivity: new Date(lastActivity)
      });
      
      // Trigger session timeout event
      window.dispatchEvent(new CustomEvent('sessionTimeout'));
    }
  }, 60000); // Check every minute
  
  // Monitor for tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      auditLogger.log('tab_hidden', { timestamp: Date.now() });
    } else {
      auditLogger.log('tab_visible', { timestamp: Date.now() });
      trackActivity();
    }
  });
  
  return {
    getActivityStats: () => ({
      mouseMovements,
      keystrokes,
      lastActivity: new Date(lastActivity),
      inactiveTime: Date.now() - lastActivity
    }),
    resetActivityCounters: () => {
      mouseMovements = 0;
      keystrokes = 0;
    }
  };
};