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
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiURL } from "@/constants/api";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function RegisterPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleRegistration = async (e: React.FormEvent) => {
    await auth.handleRegister(e, () => {
      setFormSubmitted(true);
      setTimeout(() => {
        router.push('/menu/dashboard');
      }, 2000);
    });
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${apiURL}/auth/google`;
  };

  const handleGithubSignIn = () => {
    window.location.href = `${apiURL}/auth/github`;
  };

  if (formSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Registration Successful!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 dark:text-slate-300 mb-6"
          >
            Your account has been created. You will be redirected to the dashboard shortly.
          </motion.p>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-blue-600 dark:bg-blue-500"
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration/Background */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-700 dark:to-blue-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 pattern-grid-lg opacity-10 dark:opacity-40"></div>
        <div className="absolute inset-0 bg-transparent dark:bg-white/20 flex flex-col items-center justify-center p-12">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-lg"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl font-bold text-white mb-4"
            >
              Simplify your workflow with ClarityHub
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-blue-100 mb-8"
            >
              Join thousands of teams streamlining their operations and gaining valuable insights.
            </motion.p>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6 text-left"
            >
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle2 className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-white font-medium">Intuitive analytics dashboard</p>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle2 className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-white font-medium">Seamless team collaboration</p>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle2 className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-white font-medium">Real-time data processing</p>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle2 className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-white font-medium">Custom reporting tools</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center items-center p-8 bg-white dark:bg-slate-900"
      >
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div 
            variants={fadeIn}
            className="flex items-center mb-8"
          >
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
            >
              CH
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ClarityHub
            </h1>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get started with ClarityHub in just a few steps
            </p>
          </motion.div>

          {auth.error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center"
            >
              <AlertCircle size={20} className="mr-2" />
              {auth.error}
            </motion.div>
          )}

          <motion.form 
            variants={staggerContainer}
            onSubmit={handleRegistration} 
            className="space-y-5"
          >
            {/* Full Name */}
            <motion.div variants={fadeIn}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="name"
                  value={auth.name}
                  onChange={(e) => auth.setName(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeIn}>
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
                  whileFocus={{ scale: 1.01 }}
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
            <motion.div variants={fadeIn}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
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
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => auth.setShowPassword(!auth.showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {auth.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>

              {auth.password && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Password strength: {auth.passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: auth.passwordStrength.width }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${auth.passwordStrength.color}`}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div 
              variants={fadeIn}
              className="pt-2"
            >
              <div className={`flex items-start ${auth.error && !auth.agreeToTerms ? 'text-red-600 dark:text-red-400' : ''}`}>
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="checkbox"
                  id="agreeToTerms"
                  checked={auth.agreeToTerms}
                  onChange={(e) => auth.setAgreeToTerms(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <label
                  htmlFor="agreeToTerms"
                  className={`ml-2 block text-sm ${auth.error && !auth.agreeToTerms
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* Divider */}
            <motion.div 
              variants={fadeIn}
              className="flex items-center mt-6 mb-6"
            >
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            </motion.div>

            {/* Social logins */}
            <motion.div 
              variants={fadeIn}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span>Sign up with Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleGithubSignIn}
                className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <Github size={20} className="mr-2" />
                <span>Sign up with GitHub</span>
              </motion.button>
            </motion.div>

            <motion.p 
              variants={fadeIn}
              className="text-center text-gray-600 dark:text-gray-400 mt-8"
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}