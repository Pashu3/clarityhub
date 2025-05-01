"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, User, LogOut, Shield, Home, ChevronDown, Database, Users, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AdminLogoutModal from "@/components/admin/auth/AdminLogoutModal";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSearch from "./GlobalSearch";
import NotificationPanel from "./NotificationPanel";

interface AdminNavbarProps {
  toggleSidebar: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  } | null;
  pageTitle?: string;
  onLogout?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ 
  toggleSidebar, 
  className,
  user = null,
  pageTitle = "Admin Dashboard",
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Refs for dropdown menus
  const userMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "John Smith just created an account",
      time: "2 minutes ago",
      type: "info",
      read: false
    },
    {
      id: 2,
      title: "System update completed",
      message: "The system has been updated to version 2.4.0",
      time: "1 hour ago",
      type: "success",
      read: false
    },
    {
      id: 3,
      title: "Storage limit warning",
      message: "Your storage usage is approaching 90%",
      time: "3 hours ago",
      type: "warning",
      read: true
    },
    {
      id: 4,
      title: "Failed login attempts",
      message: "Multiple failed login attempts detected for admin@example.com",
      time: "Yesterday",
      type: "error",
      read: true
    },
    {
      id: 5,
      title: "Maintenance scheduled",
      message: "System maintenance scheduled for April 30, 2025 at 2:00 AM UTC",
      time: "2 days ago",
      type: "info",
      read: true
    }
  ];

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
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

  const unreadCount = notifications.filter(n => !n.read).length;
  const isDark = theme === 'dark';

  return (
    <>
      <header className={cn(
        "h-16 border-b shadow-sm bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 z-30 relative",
        className
      )}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - includes mobile menu button and admin badge */}
          <div className="flex items-center">
            <motion.button 
              className="block md:!hidden p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              onClick={toggleSidebar}
              aria-label="Toggle mobile menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            
            {/* Admin badge */}
            <motion.div 
              className="flex items-center ml-2 mr-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-xs font-semibold">
                <Shield className="h-3.5 w-3.5 mr-1" />
                ADMIN
              </div>
            </motion.div>
            
            {/* Page title */}
            <motion.div 
              className="hidden md:block font-medium text-slate-800 dark:text-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {pageTitle}
            </motion.div>
          </div>

          {/* Center section - quick admin actions */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative" ref={adminMenuRef}>
              <motion.button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Quick Actions</span>
                <motion.div
                  animate={{ rotate: adminMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {adminMenuOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-52 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 bg-white dark:bg-slate-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { 
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05
                          }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Link href="/admin/users/new" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Add New User
                          </div>
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Link href="/admin/data/backups" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2" />
                            Database Backup
                          </div>
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Link href="/menu/dashboard" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2" />
                            Return to App
                          </div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right section - action buttons */}
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <motion.button 
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            {/* Notifications */}
            <motion.button 
              className="p-1.5 rounded-full relative hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span 
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <motion.svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ rotate: -30 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </motion.svg>
              ) : (
                <motion.svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ rotate: 30 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              )}
            </motion.button>

            {/* User menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <motion.button 
                className="flex items-center space-x-1 rounded-full p-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open user menu</span>
                {user?.avatar ? (
                  <motion.img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                ) : (
                  <motion.div 
                    className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <User className="h-5 w-5" />
                  </motion.div>
                )}
                <motion.div
                  animate={{ rotate: userMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 mr-1 hidden sm:block text-slate-500 dark:text-slate-400" />
                </motion.div>
              </motion.button>
              
              {/* User dropdown menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 bg-white dark:bg-slate-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.name}</p>
                          <p className="text-xs truncate text-slate-500 dark:text-slate-400">{user.email}</p>
                          <p className="text-xs mt-1 text-purple-600 dark:text-purple-400 font-medium">{user.role || 'Administrator'}</p>
                        </div>
                        
                        <Link href="/menu/dashboard" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2" />
                            Return to App
                          </div>
                        </Link>
                        
                        <button 
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                      <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        Not authenticated
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      
      {/* Global Search Component */}
      <GlobalSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        isDark={isDark}
      />
      
      {/* Notification Panel Component */}
      <NotificationPanel 
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
        isDark={isDark}
      />
      
      {/* Logout Confirmation Modal */}
      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
        darkMode={theme === 'dark'}
      />
    </>
  );
};

export default AdminNavbar;