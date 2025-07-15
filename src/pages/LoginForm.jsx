import React from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/ui/FormInput";
import { useForm } from "../hooks/useForm";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();

  const validationRules = {
    email: {
      required: true,
      email: true,
      label: "Email",
    },
    password: {
      required: true,
      minLength: 6,
      label: "Password",
    },
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      const response = await authService.login(formData);
      await login(response.user);
      success("Login successful! Welcome back.");
      navigate("/");
    } catch (error) {
      showError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Log In
        </h1>
        <h3 className="text-center text-gray-500 mb-6">
          Welcome back! Please enter your details.
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
        >
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
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-blue-700 text-white hover:bg-blue-500 transition focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
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
      Sign in with Google
    </span>
  </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Contact admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
