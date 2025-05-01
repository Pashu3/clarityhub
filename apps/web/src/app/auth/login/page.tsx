"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle,
  Loader2,
  Github,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Success - redirect to dashboard
      router.push("/dashboard");
      
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
   
  <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-700 dark:to-blue-900 relative overflow-hidden">
  <div className="absolute inset-0 pattern-grid-lg opacity-10 dark:opacity-40"></div>
  
  <div className="absolute inset-0 bg-transparent dark:bg-white/20"></div>
  
  <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
    <div className="text-center max-w-lg">
      <h2 className="text-3xl font-bold text-white mb-4">
        Welcome to ClarityHub
      </h2>
      <p className="text-blue-100 dark:text-white mb-6">
        The all-in-one platform for data management, analytics, and team collaboration.
      </p>
      
      {/* Much brighter testimonial card for dark mode */}
      <div className="text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:bg-white/30 dark:border-white/40 shadow-xl">
        <p className="text-white dark:text-slate-800 text-lg font-medium mb-3">
          "ClarityHub has transformed how we analyze and utilize our data. The insights we've gained have been invaluable."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center text-blue-700 dark:text-white font-medium">
            JS
          </div>
          <div className="ml-3">
            <p className="text-white dark:text-slate-800 font-medium">John Smith</p>
            <p className="text-blue-200 dark:text-slate-600 text-sm">CTO at TechCorp</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Much brighter decorative elements for dark mode */}
  <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 dark:bg-white/40 blur-3xl"></div>
  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 dark:bg-white/40 blur-3xl"></div>
</div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
              CH
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ClarityHub
            </h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {view === "login" ? "Welcome back" : "Reset your password"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {view === "login" 
                ? "Enter your credentials to access your account" 
                : "We'll send you an email with a reset link"}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}
          
          {view === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" 
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white 
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
              
              {/* Divider */}
              <div className="flex items-center mt-6 mb-6">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              </div>
              
              {/* Social logins */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
                
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Github size={20} className="mr-2" />
                  <span>Sign in with GitHub</span>
                </button>
              </div>
              
              <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                Don't have an account yet?{" "}
                <Link 
                  href="/auth/register" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              {/* Email */}
              <div>
                <label 
                  htmlFor="reset-email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" 
                  />
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                  ${isLoading 
                    ? "bg-blue-500 opacity-70 cursor-not-allowed" 
                    : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Sending link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}