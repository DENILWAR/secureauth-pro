// Validation utilities for forms and inputs
export const validationRules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    phone: {
      pattern: /^\+?[\d\s\-\(\)]{10,}$/,
      message: 'Please enter a valid phone number'
    },
    name: {
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must contain only letters and spaces'
    },
    username: {
      minLength: 3,
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: 'Username must contain only letters, numbers, hyphens and underscores'
    }
  };
  
  export const validateField = (value, fieldType, customRules = {}) => {
    const rules = { ...validationRules[fieldType], ...customRules };
    const errors = [];
  
    if (!value || value.trim() === '') {
      errors.push('This field is required');
      return { isValid: false, errors };
    }
  
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }
  
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters long`);
    }
  
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || 'Invalid format');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  export const validateForm = (formData, validationSchema) => {
    const errors = {};
    let isValid = true;
  
    Object.keys(validationSchema).forEach(field => {
      const fieldValidation = validateField(
        formData[field],
        validationSchema[field].type,
        validationSchema[field].rules
      );
  
      if (!fieldValidation.isValid) {
        errors[field] = fieldValidation.errors;
        isValid = false;
      }
    });
  
    return { isValid, errors };
  };
  
  export const validateEmail = (email) => {
    return validateField(email, 'email');
  };
  
  export const validatePassword = (password) => {
    return validateField(password, 'password');
  };
  
  export const validatePasswordConfirmation = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return {
        isValid: false,
        errors: ['Passwords do not match']
      };
    }
    return { isValid: true, errors: [] };
  };
  
  export const validatePhoneNumber = (phone) => {
    return validateField(phone, 'phone');
  };
  
  export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        isValid: false,
        errors: [`${fieldName} is required`]
      };
    }
    return { isValid: true, errors: [] };
  };
  
  export const validateMinLength = (value, minLength, fieldName = 'Field') => {
    if (value && value.length < minLength) {
      return {
        isValid: false,
        errors: [`${fieldName} must be at least ${minLength} characters long`]
      };
    }
    return { isValid: true, errors: [] };
  };
  
  export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
    if (value && value.length > maxLength) {
      return {
        isValid: false,
        errors: [`${fieldName} must be no more than ${maxLength} characters long`]
      };
    }
    return { isValid: true, errors: [] };
  };
  
  // Real-time validation for better UX
  export const createValidator = (validationSchema) => {
    return (formData) => validateForm(formData, validationSchema);
  };
  
  // Common validation schemas
  export const authValidationSchema = {
    email: {
      type: 'email',
      rules: {}
    },
    password: {
      type: 'password',
      rules: {}
    }
  };
  
  export const registerValidationSchema = {
    ...authValidationSchema,
    name: {
      type: 'name',
      rules: {}
    },
    confirmPassword: {
      type: 'password',
      rules: {}
    }
  };
  
  export const profileValidationSchema = {
    name: {
      type: 'name',
      rules: {}
    },
    email: {
      type: 'email',
      rules: {}
    },
    phone: {
      type: 'phone',
      rules: {}
    }
  };