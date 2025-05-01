"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Eye, EyeOff, Mail, Lock, 
  AlertCircle, Loader2, 
  Shield, KeySquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  darkMode?: boolean;
}

export default function AdminLoginModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  darkMode = false
}: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"login" | "2fa" | "forgot">("login");
  
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
      
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      
      // Simulating 2FA requirement for admin
      setView("2fa");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes - validation
      if (authCode.length !== 6 || !/^\d+$/.test(authCode)) {
        throw new Error("Please enter a valid 6-digit authentication code");
      }
      
      // Success
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
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
      alert(`Password reset link sent to ${email}. Contact system administrator for verification.`);
      setView("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          className="w-full max-w-md rounded-xl shadow-xl overflow-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={20} className="text-slate-500 dark:text-slate-400" />
            </button>
            
            <div className="pt-8 pb-4 px-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                  <Shield size={24} />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-center">
                {view === "login" 
                  ? "Administrator Login" 
                  : view === "2fa" 
                    ? "Two-Factor Authentication" 
                    : "Reset Admin Password"
                }
              </h2>
              
              <p className="text-center text-sm mt-2 text-slate-500 dark:text-slate-400">
                {view === "login" 
                  ? "Enter your credentials to access the admin panel"
                  : view === "2fa"
                    ? "Enter the verification code from your authenticator app"
                    : "An administrator will need to approve this request"
                }
              </p>
              
              {/* Admin security badge */}
              <div className="flex items-center justify-center mt-4">
                <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full">
                  <Shield size={12} className="mr-1" />
                  Enhanced Security
                </div>
              </div>
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
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Admin Email
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-purple-500 dark:focus:ring-purple-600"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative rounded-lg border bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-purple-500 dark:focus:ring-purple-600"
                      placeholder="••••••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-400 dark:hover:text-slate-300"
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
                    id="remember-device"
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="h-4 w-4 rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="remember-device"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Trust this device for 30 days
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    ${isLoading 
                      ? "bg-purple-600 opacity-70 cursor-not-allowed" 
                      : "bg-purple-600 hover:bg-purple-700"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
                
                <div className="mt-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 text-xs">
                  <p className="flex items-start">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      This is a secure administrator portal. Unauthorized access attempts are logged and may be reported to security personnel.
                    </span>
                  </p>
                </div>
              </form>
            )}
            
            {view === "2fa" && (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Authentication Code
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeySquare size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-purple-500 dark:focus:ring-purple-600 text-center tracking-widest font-mono"
                      placeholder="000000"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-device-2fa"
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="h-4 w-4 rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="remember-device-2fa"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Trust this device for 30 days
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    ${isLoading 
                      ? "bg-purple-600 opacity-70 cursor-not-allowed" 
                      : "bg-purple-600 hover:bg-purple-700"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify and Sign In"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Back to login
                </button>
              </form>
            )}
            
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Admin Email Address
                  </label>
                  <div className="relative rounded-lg border bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-purple-500 dark:focus:ring-purple-600"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 text-sm">
                  <p>
                    For security reasons, password resets for administrator accounts require additional verification. You will be contacted by the system administrator.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    ${isLoading 
                      ? "bg-purple-600 opacity-70 cursor-not-allowed" 
                      : "bg-purple-600 hover:bg-purple-700"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Submitting request...
                    </>
                  ) : (
                    "Submit Reset Request"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Back to sign in
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}