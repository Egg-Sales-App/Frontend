import { useState, useCallback } from "react";
import { validateForm } from "../utils/validation";

export const useForm = (initialValues, validationRules = {}, options = {}) => {
  const [values, setValues] = useState(initialValues); // ✅ FIXED: Uncommented this line
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Handle input changes
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing (if submit was attempted)
      if (submitAttempted && errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors, submitAttempted]
  );

  // Handle input blur (for touched state)
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate single field on blur if submit was attempted
      if (submitAttempted && validationRules[name]) {
        const fieldValidation = validateForm(values, {
          [name]: validationRules[name],
        });
        if (fieldValidation.errors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldValidation.errors[name],
          }));
        }
      }
    },
    [values, validationRules, submitAttempted]
  );

  // Validate all fields
  const validate = useCallback(() => {
    const validation = validateForm(values, validationRules);
    setErrors(validation.errors);
    return validation.isValid;
  }, [values, validationRules]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit) => {
      setSubmitAttempted(true);

      const validation = validateForm(values, validationRules);

      if (!validation.isValid) {
        setErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const result = await onSubmit(values);

        if (options.resetOnSuccess !== false) {
          reset();
        }

        return { success: true, data: result };
      } catch (error) {
        const errorMessage =
          error.message || "An error occurred during submission";

        // If it's a validation error from server
        if (error.validationErrors) {
          setErrors(error.validationErrors);
        } else {
          // General error
          setErrors({ submit: errorMessage });
        }

        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationRules, options]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitAttempted(false);
  }, [initialValues]);

  // Set field value programmatically
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set multiple values - FIXED: Avoid naming conflict
  const setValuesMultiple = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Get field props (convenient for input components)
  const getFieldProps = useCallback(
    (name) => ({
      value: values[name] || "",
      onChange: (e) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: errors[name],
      touched: touched[name],
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitAttempted,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setValue,
    setValues: setValuesMultiple, // ✅ FIXED: Renamed to avoid conflict
    setFieldError,
    clearFieldError,
    getFieldProps,
    // Computed properties
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
};
