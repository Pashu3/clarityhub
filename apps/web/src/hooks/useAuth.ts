"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  
  const handleLogin = async (e: React.FormEvent, onSuccess?: () => void) => {
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
      } else {
        router.push('/dashboard');
      }
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
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateRegisterStep1 = () => {
    // Validate form
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    
    return true;
  };
  
  const validateRegisterStep2 = () => {
    // Validate form
    if (!companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    
    if (!agreeToTerms) {
      setError("You must agree to the terms and privacy policy");
      return false;
    }
    
    return true;
  };
  
  const handleRegisterComplete = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setError(null);
    
    if (!validateRegisterStep2()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        // Registration successful message
        alert("Registration successful! Welcome to ClarityHub.");
        router.push('/dashboard');
      }
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

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    companyName,
    setCompanyName,
    agreeToTerms,
    setAgreeToTerms,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    setError,
    passwordStrength,
    
    // Methods
    handleLogin,
    handleForgotPassword,
    validateRegisterStep1,
    validateRegisterStep2,
    handleRegisterComplete,
    resetForm,
    getPasswordStrength
  };
}