"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  ArrowRight,
  LogIn
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiURL } from "@/constants/api";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "forgot" | "reset-sent">("login");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      auth.setEmail(rememberedEmail);
      auth.setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    await auth.handleLogin(e, () => {
      router.push('/menu/dashboard');
    });
  };
  const handleGoogleSignIn = () => {
    window.location.href = `${apiURL}/auth/google`;
  };
  
  const handleGithubSignIn = () => {
    window.location.href = `${apiURL}/auth/github`;
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    await auth.handleForgotPassword(e, () => {
      setResetEmailSent(true);
      setView("reset-sent");
      setTimeout(() => {
        setResetEmailSent(false);
        setView("login");
      }, 3000);
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-700 dark:to-blue-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 pattern-grid-lg opacity-10 dark:opacity-40"></div>
        <div className="absolute inset-0 bg-transparent dark:bg-white/20"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-12"
        >
          <div className="text-center max-w-lg">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Welcome to ClarityHub
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-blue-100 dark:text-white mb-6"
            >
              The all-in-one platform for data management, analytics, and team collaboration.
            </motion.p>

            {/* Testimonial card with motion */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:bg-white/30 dark:border-white/40 shadow-xl"
            >
              <p className="text-white dark:text-slate-800 text-lg font-medium mb-3">
                "ClarityHub has transformed how we analyze and utilize our data. The insights we've gained have been invaluable."
              </p>
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center text-blue-700 dark:text-white font-medium"
                >
                  JS
                </motion.div>
                <div className="ml-3">
                  <p className="text-white dark:text-slate-800 font-medium">John Smith</p>
                  <p className="text-blue-200 dark:text-slate-600 text-sm">CTO at TechCorp</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated decorative elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 dark:bg-white/40 blur-3xl"
        ></motion.div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 dark:bg-white/40 blur-3xl"
        ></motion.div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col justify-center items-center p-8 bg-white dark:bg-slate-900"
      >
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center mb-8"
          >
            <motion.div 
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
            >
              CH
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ClarityHub
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Different header content based on view */}
            <motion.div 
              key={`header-${view}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              {view === "login" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sign in to your account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome back! Please enter your credentials to access your dashboard
                  </p>
                </>
              )}

              {view === "forgot" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Reset your password
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </>
              )}

              {view === "reset-sent" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Check your email
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've sent a password reset link to your email address
                  </p>
                </>
              )}
            </motion.div>

            {/* Error message with animation */}
            <AnimatePresence>
              {auth.error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle size={20} className="mr-2" />
                  {auth.error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success message for password reset */}
            <AnimatePresence>
              {view === "reset-sent" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 flex items-center"
                >
                  <CheckCircle2 size={20} className="mr-2" />
                  Password reset link has been sent to your email
                </motion.div>
              )}
            </AnimatePresence>

            {/* Different forms based on view */}
            {view === "login" && (
              <motion.form 
                key="login-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLogin} 
                className="space-y-5"
              >
                {/* Email */}
                <motion.div variants={itemVariants}>
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
                    <motion.input
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      type="email"
                      id="email"
                      value={auth.email}
                      onChange={(e) => auth.setEmail(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </motion.button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                    />
                    <motion.input
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      type={auth.showPassword ? "text" : "password"}
                      id="password"
                      value={auth.password}
                      onChange={(e) => auth.setPassword(e.target.value)}
                      className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => auth.setShowPassword(!auth.showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {auth.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Remember Me */}
                <motion.div variants={itemVariants} className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={auth.rememberMe}
                    onChange={(e) => auth.setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
                  >
                    Remember me
                  </label>
                </motion.div>

                {/* Submit button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={auth.isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                    ${auth.isLoading
                      ? "bg-blue-500 opacity-70 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors flex items-center justify-center`}
                >
                  {auth.isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <motion.div variants={itemVariants} className="flex items-center mt-6 mb-6">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                </motion.div>

                {/* Social logins */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    type="button"
    onClick={handleGoogleSignIn}
    className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
    <span>Sign in with Google</span>
  </motion.button>

  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    type="button"
    onClick={handleGithubSignIn}
    className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    <Github size={20} className="mr-2" />
    <span>Sign in with GitHub</span>
  </motion.button>
</motion.div>

                <motion.p variants={itemVariants} className="text-center text-gray-600 dark:text-gray-400 mt-8">
                  Don't have an account?{" "}
                  <motion.span whileHover={{ color: "#2563EB" }}>
                    <Link
                      href="/auth/register"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Sign up
                    </Link>
                  </motion.span>
                </motion.p>
              </motion.form>
            )}

            {/* Forgot Password Form */}
            {view === "forgot" && (
              <motion.form 
                key="forgot-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleForgotPassword} 
                className="space-y-5"
              >
                {/* Email */}
                <motion.div variants={itemVariants}>
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
                    <motion.input
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      type="email"
                      id="reset-email"
                      value={auth.email}
                      onChange={(e) => auth.setEmail(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit and back buttons */}
                <motion.div variants={itemVariants} className="flex space-x-4">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={() => setView("login")}
                    className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back to Login
                  </motion.button>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={auth.isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white 
                      ${auth.isLoading
                        ? "bg-blue-500 opacity-70 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      } transition-colors flex items-center justify-center`}
                  >
                    {auth.isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <ArrowRight size={18} className="mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}