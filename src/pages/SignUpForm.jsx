import React from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";


const SignupForm = () => {
    return(
        <div className="w-full h-screen bg-white flex items-center justify-center">
        {/* Card container for the login form */}
        <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 shadow-md">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
            Create an account   

          </h1>
          <form>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                Name*
              </label>       
              <div className="relative">
              <input
                id="email"
                type="text"
                className="w-full h-10 px-4 border border-gray-400 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your name"
              />
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
              {/* Email Input */}
              <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                Email*
              </label>       
              <div className="relative">
              <input
                id="email"
                type="text"
                className="w-full h-10 px-4 border border-gray-400 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
  
            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                Password*
              </label>
              <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full h-10 px-4 border border-gray-400 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
              />
              <LockClosedIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
  
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-300"
                />
                Remember me
              </label>
             
            </div>
  
            {/* Log In Button */}
            <button
              type="submit"
              className="w-full h-10 bg-blue-700 text-white  hover:bg-blue-500 transition focus:outline-none focus:ring focus:ring-blue-300"
            >
            Get started
            </button>
          </form>
  
          {/* Create Account */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/signup"
              className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>    )

}

export default SignupForm;