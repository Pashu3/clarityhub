import { useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, requestPasswordReset, getAuthStatus, logoutUser } from '@/app/actions/auth';

// Define a type for the user data
interface UserInfo {
  id: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string;
  role?: string;
  isActive?: boolean;
}

export function useAuth() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserInfo | null>(null);

  const calculatePasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-gray-300', label: 'None' };
    
    const strength = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLong: password.length >= 8,
    };
    
    const criteriaCount = Object.values(strength).filter(Boolean).length;
    
    if (criteriaCount <= 1) return { width: '20%', color: 'bg-red-500', label: 'Weak' };
    if (criteriaCount === 2) return { width: '40%', color: 'bg-orange-500', label: 'Fair' };
    if (criteriaCount === 3) return { width: '60%', color: 'bg-yellow-500', label: 'Good' };
    if (criteriaCount === 4) return { width: '80%', color: 'bg-blue-500', label: 'Strong' };
    return { width: '100%', color: 'bg-green-500', label: 'Very Strong' };
  };

  const passwordStrength = calculatePasswordStrength();

const checkAuthStatus = useCallback(async () => {
  try {
    setIsLoading(true);
    
    const statusResponse = await getAuthStatus();
    
    setIsAuthenticated(statusResponse.isAuthenticated);
    
    setUserData(statusResponse.user);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', statusResponse.isAuthenticated ? 'true' : 'false');
    }
    
    return statusResponse.isAuthenticated;
  } catch (err) {
    console.error('Error checking auth status:', err);
    console.error('Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : 'No stack trace'
    });
    
    setIsAuthenticated(false);
    setUserData(null);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'false');
    }
    
    return false;
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  checkAuthStatus();
  
  const interval = setInterval(() => {
    checkAuthStatus();
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, [checkAuthStatus]);

  useEffect(() => {
    const loadInitialAuthState = () => {
      if (typeof window !== 'undefined') {
        const storedAuthStatus = localStorage.getItem('isAuthenticated');
        if (storedAuthStatus) {
          setIsAuthenticated(storedAuthStatus === 'true');
          
          if (storedAuthStatus === 'true') {
            checkAuthStatus();
          }
        } else {
          checkAuthStatus();
        }
      }
    };

    loadInitialAuthState();
  }, [checkAuthStatus]);

  // Handle registration
  const handleRegister = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill out all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await registerUser({
        name: name.trim(),
        email,
        password
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthenticated', 'true');
        }
        
        await checkAuthStatus();
        
        onSuccess();
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser({
        email,
        password
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthenticated', 'true');
        }
        
        await checkAuthStatus();
        
        onSuccess();
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (onSuccess?: () => void) => {
    try {
      setIsLoading(true);
      const response = await logoutUser();
      
      if (response.success) {
        setIsAuthenticated(false);
        setUserData(null);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthenticated', 'false');
        }
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await requestPasswordReset(email);
      
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to send password reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    agreeToTerms,
    setAgreeToTerms,
    showPassword,
    setShowPassword,
    error,
    setError,
    isLoading,
    isAuthenticated,
    userData,
    passwordStrength,
    checkAuthStatus,
    handleRegister,
    handleLogin,
    handleLogout,
    handleForgotPassword,
  };
}