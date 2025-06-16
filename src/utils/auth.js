// Authentication utilities and token management
import { SESSION_CONFIG, AUTH_STATES } from './constants.js';

// Token management
export const getToken = () => {
  try {
    return localStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(SESSION_CONFIG.TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error setting token:', error);
    return false;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(SESSION_CONFIG.TOKEN_KEY);
    localStorage.removeItem(SESSION_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_CONFIG.USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(SESSION_CONFIG.REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const setRefreshToken = (refreshToken) => {
  try {
    localStorage.setItem(SESSION_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    return true;
  } catch (error) {
    console.error('Error setting refresh token:', error);
    return false;
  }
};

// User data management
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(SESSION_CONFIG.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    localStorage.setItem(SESSION_CONFIG.USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting stored user:', error);
    return false;
  }
};

// JWT utilities
export const parseJWT = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenExpiration = (token) => {
  try {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

export const shouldRefreshToken = (token) => {
  try {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    const expirationTime = decoded.exp;
    const timeUntilExpiry = (expirationTime - currentTime) * 1000;
    
    return timeUntilExpiry < SESSION_CONFIG.REFRESH_THRESHOLD;
  } catch (error) {
    console.error('Error checking if token should refresh:', error);
    return true;
  }
};

// Authentication state management
export const getAuthState = () => {
  const token = getToken();
  const user = getStoredUser();
  
  if (!token || !user) {
    return AUTH_STATES.UNAUTHENTICATED;
  }
  
  if (isTokenExpired(token)) {
    const refreshToken = getRefreshToken();
    if (!refreshToken || isTokenExpired(refreshToken)) {
      removeToken();
      return AUTH_STATES.UNAUTHENTICATED;
    }
    return AUTH_STATES.LOADING; // Needs refresh
  }
  
  return AUTH_STATES.AUTHENTICATED;
};

export const isAuthenticated = () => {
  const state = getAuthState();
  return state === AUTH_STATES.AUTHENTICATED;
};

// Session management
export const createSession = (authData) => {
  try {
    const { token, refreshToken, user, expiresIn } = authData;
    
    if (!token || !user) {
      throw new Error('Invalid authentication data');
    }
    
    setToken(token);
    setStoredUser(user);
    
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    
    // Set session expiry if provided
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem('session_expiry', expiryTime.toString());
    }
    
    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
};

export const destroySession = () => {
  try {
    removeToken();
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('biometric_enabled');
    localStorage.removeItem('remember_me');
    
    // Clear any other auth-related data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_') || key.startsWith('user_')) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error destroying session:', error);
    return false;
  }
};

export const isSessionExpired = () => {
  try {
    const expiryTime = localStorage.getItem('session_expiry');
    if (!expiryTime) return false;
    
    return Date.now() > parseInt(expiryTime);
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return true;
  }
};

// Password utilities
export const generateSecurePassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '@$!%*?&';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: 'Enter a password' };
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');
  
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');
  
  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Include special characters');
  
  // Bonus points
  if (password.length >= 16) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : score <= 6 ? 'strong' : 'very strong';
  
  return {
    score: Math.min(score, 8),
    strength,
    feedback: feedback.length > 0 ? feedback : ['Password looks good!']
  };
};

// Biometric authentication utilities
export const isBiometricSupported = async () => {
  try {
    if (!window.PublicKeyCredential) return false;
    
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking biometric support:', error);
    return false;
  }
};

export const getBiometricSettings = () => {
  try {
    const settings = localStorage.getItem('biometric_settings');
    return settings ? JSON.parse(settings) : {
      enabled: false,
      type: null,
      lastUsed: null
    };
  } catch (error) {
    console.error('Error getting biometric settings:', error);
    return { enabled: false, type: null, lastUsed: null };
  }
};

export const setBiometricSettings = (settings) => {
  try {
    localStorage.setItem('biometric_settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error setting biometric settings:', error);
    return false;
  }
};

// Device fingerprinting
export const generateDeviceFingerprint = async () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: getWebGLFingerprint(),
      timestamp: Date.now()
    };
    
    const hash = await crypto.subtle.digest('SHA-256', 
      new TextEncoder().encode(JSON.stringify(fingerprint))
    );
    
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    return null;
  }
};

const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return null;
    
    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };
  } catch (error) {
    return null;
  }
};

// Security utilities
export const sanitizeRedirectUrl = (url) => {
  if (!url) return '/';
  
  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Only allow same-origin redirects
    if (parsedUrl.origin !== window.location.origin) {
      return '/';
    }
    
    return parsedUrl.pathname + parsedUrl.search;
  } catch (error) {
    return '/';
  }
};

export const generateNonce = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const generateState = () => {
  return generateNonce(16);
};