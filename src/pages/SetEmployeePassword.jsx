import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { employeeService } from "../services/employeeService";
import { useToast } from "../components/ui/ToastContext";
import { passwordValidation } from "../utils/passwordValidation";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

const SetEmployeePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error: showError, info } = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password validation rules
  const passwordRules = passwordValidation.validatePassword(formData.password);
  const isPasswordValid = passwordValidation.isPasswordValid(formData.password);
  const passwordStrength = passwordValidation.getPasswordStrengthLevel(
    formData.password
  );
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";
  const isCommonPassword = passwordValidation.isCommonPassword(
    formData.password
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      showError("Invalid password setup link");
      navigate("/login");
      return;
    }

    // Validate token and get user info
    validateToken(token);
  }, [searchParams, showError, navigate]);

  const validateToken = async (token) => {
    try {
      setLoading(true);
      // Call API to validate token and get user email
      const response = await employeeService.validatePasswordToken(token);

      if (response.valid) {
        setTokenValid(true);
        setUserEmail(response.email);
        info(`Setting up password for ${response.email}`);
      } else {
        setTokenValid(false);
        showError("Password setup link has expired or is invalid");
        setTimeout(() => navigate("/login"), 10000);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setTokenValid(false);
      showError("Failed to validate password setup link");
      setTimeout(() => navigate("/login"), 10000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showError("Please ensure your password meets all requirements");
      return;
    }

    if (isCommonPassword) {
      showError("Please choose a less common password for better security");
      return;
    }

    if (!passwordsMatch) {
      showError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      const token = searchParams.get("token");

      await employeeService.setEmployeePassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      success("Password set successfully! Redirecting to login...");

      // Clear form
      setFormData({ password: "", confirmPassword: "" });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password setup complete. Please log in with your new credentials.",
            email: userEmail,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Password setup error:", error);
      showError(error.message || "Failed to set password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const PasswordRule = ({ met, text }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors ${
        met ? "text-green-600" : "text-gray-500"
      }`}
    >
      {met ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <XCircle size={16} className="text-gray-400" />
      )}
      <span>{text}</span>
    </div>
  );

  if (loading && tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Validating setup link...</span>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Invalid Link
          </h2>
          <p className="text-gray-600 mb-4">
            This password setup link has expired or is invalid. Please contact
            your administrator.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Set Your Password
          </h1>
          <p className="text-gray-600">
            Welcome! Please create a secure password for your account
          </p>
          {userEmail && (
            <p className="text-sm text-blue-600 mt-2 font-medium">
              {userEmail}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter your new password"
                disabled={submitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                  formData.confirmPassword && !passwordsMatch
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Confirm your new password"
                disabled={submitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-sm text-red-600">
                Passwords do not match
              </p>
            )}
            {passwordsMatch && formData.confirmPassword && (
              <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={16} />
                Passwords match
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Password Requirements:
              </h4>
              {formData.password && (
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    passwordStrength.color === "green"
                      ? "bg-green-100 text-green-700"
                      : passwordStrength.color === "yellow"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {passwordStrength.text}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <PasswordRule
                met={passwordRules.minLength}
                text="At least 8 characters"
              />
              <PasswordRule
                met={passwordRules.hasUppercase}
                text="One uppercase letter"
              />
              <PasswordRule
                met={passwordRules.hasLowercase}
                text="One lowercase letter"
              />
              <PasswordRule met={passwordRules.hasNumber} text="One number" />
              <PasswordRule
                met={passwordRules.hasSpecialChar}
                text="One special character"
              />
            </div>
            {isCommonPassword && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                ⚠️ This password is too common. Please choose a more unique
                password.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !isPasswordValid ||
              !passwordsMatch ||
              submitting ||
              isCommonPassword
            }
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting Password...
              </>
            ) : (
              <>
                <Lock size={18} />
                Set Password
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            🔒 Your password is encrypted and securely stored. Make sure to
            remember it as it cannot be recovered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetEmployeePassword;
