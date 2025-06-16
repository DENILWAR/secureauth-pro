// API utilities and HTTP client configuration
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from './constants.js';
import { getToken, removeToken } from './auth.js';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.retries = API_CONFIG.retries;
    this.interceptors = {
      request: [],
      response: []
    };
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let processedConfig = { ...config };
    
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let processedResponse = response;
    
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  // Create request configuration
  createRequestConfig(url, options = {}) {
    const token = getToken();
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    // Handle FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Handle JSON body
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    return config;
  }

  // Make HTTP request with retry logic
  async makeRequest(url, options = {}, retryCount = 0) {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      const config = await this.applyRequestInterceptors(
        this.createRequestConfig(fullUrl, options)
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(fullUrl, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const processedResponse = await this.applyResponseInterceptors(response);
      
      if (!processedResponse.ok) {
        throw new ApiError(
          processedResponse.status,
          processedResponse.statusText,
          await this.parseResponse(processedResponse)
        );
      }

      return await this.parseResponse(processedResponse);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout', { message: 'Request timed out' });
      }

      if (retryCount < this.retries && this.shouldRetry(error)) {
        return this.makeRequest(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  // Parse response based on content type
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    if (contentType && contentType.includes('text/')) {
      return await response.text();
    }
    
    return await response.blob();
  }

  // Determine if request should be retried
  shouldRetry(error) {
    if (error instanceof ApiError) {
      return [408, 429, 500, 502, 503, 504].includes(error.status);
    }
    return false;
  }

  // HTTP Methods
  async get(url, options = {}) {
    return this.makeRequest(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'POST',
      body: data
    });
  }

  async put(url, data, options = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'PUT',
      body: data
    });
  }

  async patch(url, data, options = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'PATCH',
      body: data
    });
  }

  async delete(url, options = {}) {
    return this.makeRequest(url, { ...options, method: 'DELETE' });
  }

  // Upload file
  async upload(url, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.fields) {
      Object.entries(options.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.makeRequest(url, {
      ...options,
      method: 'POST',
      body: formData
    });
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(status, statusText, data = {}) {
    super(data.message || statusText || 'API Error');
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Add default interceptors
apiClient.addRequestInterceptor((config) => {
  console.log(`Making ${config.method} request to ${config.url}`);
  return config;
});

apiClient.addResponseInterceptor(async (response) => {
  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    removeToken();
    window.location.href = '/login';
  }
  return response;
});

// Authentication API
export const authApi = {
  login: (credentials) => 
    apiClient.post(API_CONFIG.endpoints.auth.login, credentials),
  
  register: (userData) => 
    apiClient.post(API_CONFIG.endpoints.auth.register, userData),
  
  logout: () => 
    apiClient.post(API_CONFIG.endpoints.auth.logout),
  
  refreshToken: (refreshToken) => 
    apiClient.post(API_CONFIG.endpoints.auth.refresh, { refreshToken }),
  
  verifyEmail: (token) => 
    apiClient.post(API_CONFIG.endpoints.auth.verify, { token }),
  
  forgotPassword: (email) => 
    apiClient.post(API_CONFIG.endpoints.auth.forgot, { email }),
  
  resetPassword: (token, password) => 
    apiClient.post(API_CONFIG.endpoints.auth.reset, { token, password }),
  
  enableTwoFactor: () => 
    apiClient.post(API_CONFIG.endpoints.auth.twoFactor),
  
  verifyTwoFactor: (code) => 
    apiClient.post(`${API_CONFIG.endpoints.auth.twoFactor}/verify`, { code })
};

// Biometric API
export const biometricApi = {
  register: (biometricData) => 
    apiClient.post(API_CONFIG.endpoints.biometric.register, biometricData),
  
  verify: (biometricData) => 
    apiClient.post(API_CONFIG.endpoints.biometric.verify, biometricData),
  
  delete: (biometricId) => 
    apiClient.delete(`${API_CONFIG.endpoints.biometric.delete}/${biometricId}`)
};

// User API
export const userApi = {
  getProfile: () => 
    apiClient.get(API_CONFIG.endpoints.user.profile),
  
  updateProfile: (profileData) => 
    apiClient.put(API_CONFIG.endpoints.user.profile, profileData),
  
  getSettings: () => 
    apiClient.get(API_CONFIG.endpoints.user.settings),
  
  updateSettings: (settings) => 
    apiClient.put(API_CONFIG.endpoints.user.settings, settings),
  
  getActivity: (params = {}) => 
    apiClient.get(`${API_CONFIG.endpoints.user.activity}?${new URLSearchParams(params)}`)
};

// Security API
export const securityApi = {
  getAlerts: (params = {}) => 
    apiClient.get(`${API_CONFIG.endpoints.security.alerts}?${new URLSearchParams(params)}`),
  
  dismissAlert: (alertId) => 
    apiClient.patch(`${API_CONFIG.endpoints.security.alerts}/${alertId}/dismiss`),
  
  getLogs: (params = {}) => 
    apiClient.get(`${API_CONFIG.endpoints.security.logs}?${new URLSearchParams(params)}`),
  
  getDevices: () => 
    apiClient.get(API_CONFIG.endpoints.security.devices),
  
  removeDevice: (deviceId) => 
    apiClient.delete(`${API_CONFIG.endpoints.security.devices}/${deviceId}`)
};

// Helper functions for common API patterns
export const createApiHook = (apiFunction) => {
  return async (...args) => {
    try {
      const response = await apiFunction(...args);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
};

export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.SESSION_EXPIRED;
      case HTTP_STATUS.NOT_FOUND:
        return 'Resource not found';
      case HTTP_STATUS.BAD_REQUEST:
        return error.data?.message || 'Invalid request';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Server error. Please try again later.';
      default:
        return error.message || ERROR_MESSAGES.GENERIC_ERROR;
    }
  }
  
  if (error.name === 'NetworkError' || !navigator.onLine) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
};

// Request queue for offline support
export class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(request) {
    this.queue.push(request);
    this.process();
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0 && navigator.onLine) {
      const request = this.queue.shift();
      try {
        await request();
      } catch (error) {
        console.error('Queued request failed:', error);
      }
    }
    
    this.isProcessing = false;
  }
}

export const requestQueue = new RequestQueue();

// Network status monitoring
export const setupNetworkMonitoring = () => {
  window.addEventListener('online', () => {
    requestQueue.process();
  });
  
  window.addEventListener('offline', () => {
    console.log('Application is offline');
  });
};

// Cache utilities
export const createCache = (ttl = 5 * 60 * 1000) => { // 5 minutes default
  const cache = new Map();
  
  const set = (key, value) => {
    cache.set(key, {
      value,
      timestamp: Date.now()
    });
  };
  
  const get = (key) => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return item.value;
  };
  
  const clear = () => cache.clear();
  
  return { set, get, clear };
};

// Global API cache
export const apiCache = createCache();

// Cached API wrapper
export const withCache = (apiFunction, cacheKey, ttl) => {
  return async (...args) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    const cached = apiCache.get(key);
    
    if (cached) return cached;
    
    const result = await apiFunction(...args);
    apiCache.set(key, result);
    
    return result;
  };
};