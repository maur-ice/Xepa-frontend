// Validation utilities

import { VALIDATION_RULES } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return VALIDATION_RULES.EMAIL.MESSAGE;
  }
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  }
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `Password must be less than ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`;
  }
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return VALIDATION_RULES.PASSWORD.MESSAGE;
  }
  return '';
};

// Name validation
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  }
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return `Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }
  if (!VALIDATION_RULES.NAME.PATTERN.test(name)) {
    return VALIDATION_RULES.NAME.MESSAGE;
  }
  return '';
};

// Title validation
export const validateTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
    return `Title must be at least ${VALIDATION_RULES.TITLE.MIN_LENGTH} characters`;
  }
  if (title.length > VALIDATION_RULES.TITLE.MAX_LENGTH) {
    return `Title must be less than ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`;
  }
  return '';
};

// Description validation
export const validateDescription = (description) => {
  if (!description) return 'Description is required';
  if (description.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
    return `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`;
  }
  if (description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return `Description must be less than ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
  }
  return '';
};

// Hours validation
export const validateHours = (hours) => {
  if (!hours && hours !== 0) return 'Hours are required';
  const numHours = parseFloat(hours);
  if (isNaN(numHours)) return 'Hours must be a number';
  if (numHours < VALIDATION_RULES.HOURS_WORKED.MIN) {
    return `Hours must be at least ${VALIDATION_RULES.HOURS_WORKED.MIN}`;
  }
  if (numHours > VALIDATION_RULES.HOURS_WORKED.MAX) {
    return `Hours cannot exceed ${VALIDATION_RULES.HOURS_WORKED.MAX} per day`;
  }
  return '';
};

// Date validation
export const validateDate = (date) => {
  if (!date) return 'Date is required';
  const inputDate = new Date(date);
  const today = new Date();
  
  if (inputDate > today) {
    return 'Date cannot be in the future';
  }
  
  // Check if date is within reasonable range (e.g., last 5 years)
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  
  if (inputDate < fiveYearsAgo) {
    return 'Date is too far in the past';
  }
  
  return '';
};

// URL validation
export const validateURL = (url) => {
  if (!url) return '';
  
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return '';
  
  const pattern = /^[\+]?[1-9][\d]{0,15}$/;
  if (!pattern.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value && value !== 0 && value !== false) {
    return `${fieldName} is required`;
  }
  return '';
};

// Number validation
export const validateNumber = (value, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) {
    return 'Value is required';
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) return 'Value must be a number';
  
  if (min !== null && num < min) {
    return `Value must be at least ${min}`;
  }
  
  if (max !== null && num > max) {
    return `Value cannot exceed ${max}`;
  }
  
  return '';
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !value && value !== 0 && value !== false) {
      errors[field] = fieldRules.message || `${field} is required`;
      return;
    }
    
    if (value && fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || `Invalid ${field} format`;
      return;
    }
    
    if (value && fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.minLength} characters`;
      return;
    }
    
    if (value && fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || `${field} must be less than ${fieldRules.maxLength} characters`;
      return;
    }
    
    if (value && fieldRules.min && parseFloat(value) < fieldRules.min) {
      errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.min}`;
      return;
    }
    
    if (value && fieldRules.max && parseFloat(value) > fieldRules.max) {
      errors[field] = fieldRules.message || `${field} cannot exceed ${fieldRules.max}`;
      return;
    }
    
    if (value && fieldRules.custom) {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

// Validate work entry
export const validateWorkEntry = (workEntry) => {
  const errors = {};
  
  const titleError = validateTitle(workEntry.title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateDescription(workEntry.description);
  if (descriptionError) errors.description = descriptionError;
  
  const hoursError = validateHours(workEntry.hoursWorked);
  if (hoursError) errors.hoursWorked = hoursError;
  
  const dateError = validateDate(workEntry.dateCompleted);
  if (dateError) errors.dateCompleted = dateError;
  
  if (!workEntry.category) errors.category = 'Category is required';
  if (!workEntry.priority) errors.priority = 'Priority is required';
  
  return errors;
};

// Validate approval action
export const validateApproval = (approvalData) => {
  const errors = {};
  
  if (!approvalData.action) errors.action = 'Action is required';
  
  if (approvalData.action === 'rejected' && !approvalData.reason) {
    errors.reason = 'Rejection reason is required';
  }
  
  if (!approvalData.comments) {
    errors.comments = 'Comments are required';
  }
  
  return errors;
};

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validateName,
  validateTitle,
  validateDescription,
  validateHours,
  validateDate,
  validateURL,
  validatePhone,
  validateRequired,
  validateNumber,
  validateForm,
  validateWorkEntry,
  validateApproval,
};