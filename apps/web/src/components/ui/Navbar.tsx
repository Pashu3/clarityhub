"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, User, LogOut, Settings, UserPlus, ChevronDown, LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import LogoutModal from "@/components/auth/LogoutModal";


interface NavbarProps {
  toggleSidebar: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  } | null; // Null means not authenticated
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  toggleSidebar, 
  className,
  user = null, // Default to not authenticated
  onLogin,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Ref for user menu dropdown
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle login success
  const handleLoginSuccess = () => {
    if (onLogin) {
      onLogin();
    }
    setIsLoginModalOpen(false);
  };
  
  // Handle logout confirm
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
      // Simulate API call for logout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onLogout) {
        onLogout();
      }
      
      setIsLogoutModalOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header className={cn(
        "h-16 border-b shadow-sm bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800",
        className
      )}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - includes mobile menu button that only appears on small screens */}
          <div className="flex items-center">
            <button 
              className="block md:!hidden p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              onClick={toggleSidebar}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Page title or breadcrumbs could go here */}
            <div className="hidden md:block ml-4 font-medium text-gray-800 dark:text-gray-200">
              Dashboard
            </div>
          </div>

          {/* Center section - search bar */}
          <div className="hidden md:flex relative max-w-md w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 pl-10 pr-4 rounded-lg border-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Right section - action buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile search button */}
            <button className="block md:!hidden p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Notifications */}
            <button className="p-1.5 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button 
                className="flex items-center space-x-1 rounded-full p-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <ChevronDown className="h-4 w-4 mr-1 hidden sm:block text-gray-500 dark:text-gray-400" />
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 bg-white dark:bg-gray-800">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                        <p className="text-xs truncate text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      
                      <Link href="/menu/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </div>
                      </Link>
                      
                      <button 
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                      >
                        <div className="flex items-center">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign in
                        </div>
                      </button>
                      
                      <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create account
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        darkMode={theme === 'dark'}
      />
      
      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
        darkMode={theme === 'dark'}
      />
    </>
  );
};

export default Navbar;