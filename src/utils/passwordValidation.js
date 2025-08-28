/**
 * Password validation utilities following industry standards
 */

export const passwordValidation = {
  // Minimum password requirements
  rules: {
    minLength: 8,
    maxLength: 128,
    patterns: {
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /\d/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    },
  },

  // Check if password meets all requirements
  validatePassword(password) {
    const { rules } = this;

    return {
      minLength: password.length >= rules.minLength,
      maxLength: password.length <= rules.maxLength,
      hasUppercase: rules.patterns.uppercase.test(password),
      hasLowercase: rules.patterns.lowercase.test(password),
      hasNumber: rules.patterns.number.test(password),
      hasSpecialChar: rules.patterns.specialChar.test(password),
    };
  },

  // Get password strength score (0-5)
  getPasswordStrength(password) {
    const validation = this.validatePassword(password);
    const checks = Object.values(validation);
    return checks.filter(Boolean).length;
  },

  // Get password strength level
  getPasswordStrengthLevel(password) {
    const strength = this.getPasswordStrength(password);

    if (strength <= 2) return { level: "weak", color: "red", text: "Weak" };
    if (strength <= 4)
      return { level: "medium", color: "yellow", text: "Medium" };
    return { level: "strong", color: "green", text: "Strong" };
  },

  // Check if password is valid (meets all requirements)
  isPasswordValid(password) {
    const validation = this.validatePassword(password);
    return Object.values(validation).every(Boolean);
  },

  // Common password patterns to avoid
  commonPatterns: [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
  ],

  // Check for common weak passwords
  isCommonPassword(password) {
    return this.commonPatterns.some((pattern) => pattern.test(password));
  },

  // Generate password requirements text
  getRequirementsText() {
    return [
      `At least ${this.rules.minLength} characters`,
      "One uppercase letter (A-Z)",
      "One lowercase letter (a-z)",
      "One number (0-9)",
      "One special character (!@#$%^&*)",
    ];
  },
};

export default passwordValidation;
