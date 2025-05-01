"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Eye, EyeOff, Mail, Lock, 
  ExternalLink, AlertCircle, Loader2, 
  Github, User, Building, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  darkMode?: boolean;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  darkMode = false
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"login" | "forgot" | "register" | "register-2">("login");
  
  // Get password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "", width: "0%" };
    
    const length = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const conditions = [
      length >= 8,
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSpecial
    ];
    
    const strength = conditions.filter(Boolean).length;
    
    if (strength <= 1) {
      return { label: "Weak", color: "bg-red-500", width: "20%" };
    } else if (strength <= 3) {
      return { label: "Moderate", color: "bg-amber-500", width: "60%" };
    } else {
      return { label: "Strong", color: "bg-green-500", width: "100%" };
    }
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes - validation
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Success
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      
      // Success
      setError(null);
      alert(`Password reset link sent to ${email}`);
      setView("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    // Move to step 2
    setView("register-2");
  };
  
  const handleRegisterComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Validate form
    if (!companyName.trim()) {
      setError("Company name is required");
      setIsLoading(false);
      return;
    }
    
    if (!agreeToTerms) {
      setError("You must agree to the terms and privacy policy");
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      if (onSuccess) {
        onSuccess();
      }
      
      // Registration successful message
      alert("Registration successful! Welcome to ClarityHub.");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setCompanyName("");
    setAgreeToTerms(false);
    setError(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <div className="pt-8 pb-4 px-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  CH
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-center">
                {view === "login" ? "Sign in to ClarityHub" : 
                 view === "forgot" ? "Reset your password" :
                 view === "register" ? "Create an account" :
                 "Complete your registration"}
              </h2>
              
              <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
                {view === "login" 
                  ? "Enter your credentials to access your account"
                  : view === "forgot"
                  ? "We'll send you an email with a reset link"
                  : view === "register"
                  ? "Fill in your information to get started"
                  : "Just a few more details to complete your profile"
                }
              </p>
            </div>
          </div>
          
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-6 mb-4 p-3 rounded-lg flex items-center text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200"
              >
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Form */}
          <div className="px-6 pb-6">
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    ${isLoading 
                      ? "bg-blue-500 opacity-70 cursor-not-allowed" 
                      : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
                
                <div className="pt-2 flex items-center text-gray-500 dark:text-gray-400">
                  <div className="flex-1 h-px bg-current"></div>
                  <span className="px-3 text-xs font-medium uppercase">Or continue with</span>
                  <div className="flex-1 h-px bg-current"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {/* Google icon as inline SVG */}
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Github size={18} className="mr-2" />
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                </div>
                
                <p className="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setView("register");
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign up for free
                  </button>
                </p>
              </form>
            )}
            
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    ${isLoading 
                      ? "bg-blue-500 opacity-70 cursor-not-allowed" 
                      : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to sign in
                </button>
              </form>
            )}
            
            {view === "register" && (
              <form onSubmit={handleRegisterStep1} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-1.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Password strength: {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color}`} 
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  Continue
                </button>
                
                <div className="pt-2 flex items-center text-gray-500 dark:text-gray-400">
                  <div className="flex-1 h-px bg-current"></div>
                  <span className="px-3 text-xs font-medium uppercase">Or continue with</span>
                  <div className="flex-1 h-px bg-current"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {/* Google icon as inline SVG */}
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Github size={18} className="mr-2" />
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                </div>
                
                <p className="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
            
            {view === "register-2" && (
              <form onSubmit={handleRegisterComplete} className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Company Name
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                </div>
                
                {/* Terms Agreement */}
                <div className="pt-2">
                  <div className={`flex items-start ${error && !agreeToTerms ? 'text-red-600 dark:text-red-400' : ''}`}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 mt-0.5"
                    />
                    <label 
                      htmlFor="terms" 
                      className={`ml-2 block text-sm ${
                        error && !agreeToTerms
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setView("register")}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-white 
                      ${isLoading 
                        ? "bg-blue-500 opacity-70 cursor-not-allowed" 
                        : "bg-blue-500 hover:bg-blue-600"
                      } transition-colors flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
                
                <p className="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}