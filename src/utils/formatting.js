// Formatting utilities for data presentation
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('en-US', formatOptions);
  };
  
  export const formatTime = (date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleTimeString('en-US', formatOptions);
  };
  
  export const formatDateTime = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const dateStr = formatDate(date, options.date);
    const timeStr = formatTime(date, options.time);
    
    return `${dateStr} at ${timeStr}`;
  };
  
  export const formatRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const dateObj = new Date(date);
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(date);
  };
  
  export const formatCurrency = (amount, currency = 'USD', options = {}) => {
    const defaultOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', formatOptions).format(amount);
  };
  
  export const formatNumber = (number, options = {}) => {
    if (number === null || number === undefined || isNaN(number)) return '0';
    
    const defaultOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    return new Intl.NumberFormat('en-US', formatOptions).format(number);
  };
  
  export const formatPercentage = (value, options = {}) => {
    const defaultOptions = {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (value === null || value === undefined || isNaN(value)) return '0%';
    
    // Convert to decimal if it's already a percentage (>1)
    const decimal = value > 1 ? value / 100 : value;
    
    return new Intl.NumberFormat('en-US', formatOptions).format(decimal);
  };
  
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  };
  
  export const formatCreditCard = (cardNumber) => {
    if (!cardNumber) return '';
    
    // Remove all non-numeric characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };
  
  export const maskCreditCard = (cardNumber) => {
    if (!cardNumber) return '';
    
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 4) return cardNumber;
    
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    
    return `${masked}${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
  };
  
  export const formatName = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    if (!firstName) return lastName;
    if (!lastName) return firstName;
    return `${firstName} ${lastName}`;
  };
  
  export const formatInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  };
  
  export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + suffix;
  };
  
  export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
  
  export const slugify = (str) => {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  };
  
  export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    return searchParams.toString();
  };