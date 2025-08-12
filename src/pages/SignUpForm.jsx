import React from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/ui/FormInput";
import { useForm } from "../hooks/useForm";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const SignupForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { success, error: showError } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validationRules = {
    username: {
      required: true,
      minLength: 2,
      label: "Username",
    },
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
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { username: "", email: "", password: "" },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      console.log("📝 Registration form submission started...");
      const response = await authService.register({
        ...formData,
        confirmPassword: formData.password, // Add confirm password
      });

      console.log("✅ Registration form received response:", {
        success: response.success,
        hasUser: !!response.user,
        message: response.message,
      });

      success(
        response.message ||
          "Registration successful! Please check your email for verification."
      );

      console.log("🚀 Redirecting to login page...");
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration form error:", {
        message: error.message,
        fieldErrors: error.fieldErrors,
        statusCode: error.statusCode,
      });

      // Use the enhanced error message from authService
      let errorMessage =
        error.message || "Registration failed. Please try again.";

      // If there are field-specific errors, show them
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        const fieldErrorMessages = Object.entries(error.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(". ");
        errorMessage = fieldErrorMessages;
      }

      showError(errorMessage);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Create an account
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
        >
          <FormInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={errors.username}
            required
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            required
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-blue-700 text-white hover:bg-blue-500 transition focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating account..." : "Get started"}
          </button>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={() => console.log("Handle Google Sign-In")}
            className="w-full h-10 mt-4 border border-gray-300 flex items-center justify-center gap-2 rounded-md bg-white hover:bg-gray-100 active:scale-[0.98] transition duration-150 ease-in-out shadow-sm cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="h-5 w-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Sign up with Google
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
