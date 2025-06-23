export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${fieldRules.label || field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Email validation
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = "Please enter a valid email address";
      return;
    }

    // Password validation
    if (fieldRules.password && !validatePassword(value)) {
      errors[field] = "Password must be at least 8 characters long";
      return;
    }

    // Min length validation
    if (
      fieldRules.minLength &&
      !validateMinLength(value, fieldRules.minLength)
    ) {
      errors[field] = `${fieldRules.label || field} must be at least ${
        fieldRules.minLength
      } characters`;
      return;
    }

    // Max length validation
    if (
      fieldRules.maxLength &&
      !validateMaxLength(value, fieldRules.maxLength)
    ) {
      errors[field] = `${fieldRules.label || field} must not exceed ${
        fieldRules.maxLength
      } characters`;
      return;
    }

    // Number validation
    if (fieldRules.number && !validateNumber(value)) {
      errors[field] = `${fieldRules.label || field} must be a valid number`;
      return;
    }

    // Positive number validation
    if (fieldRules.positiveNumber && !validatePositiveNumber(value)) {
      errors[field] = `${fieldRules.label || field} must be a positive number`;
      return;
    }

    // Phone validation
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = "Please enter a valid phone number";
      return;
    }

    // Custom validation function
    if (fieldRules.custom && typeof fieldRules.custom === "function") {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Specific validation rules for common use cases
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
    label: "Email",
  },
  password: {
    required: true,
    minLength: 8,
    label: "Password",
  },
  confirmPassword: (password) => ({
    required: true,
    label: "Confirm Password",
    custom: (value, formData) => {
      if (value !== formData[password]) {
        return "Passwords do not match";
      }
      return null;
    },
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    label: "Name",
  },
  phone: {
    required: true,
    phone: true,
    label: "Phone Number",
  },
  price: {
    required: true,
    positiveNumber: true,
    label: "Price",
  },
  quantity: {
    required: true,
    positiveNumber: true,
    label: "Quantity",
  },
};
