"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, User, LogOut, Settings, UserPlus, ChevronDown, LogIn, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import LogoutModal from "@/components/auth/LogoutModal";
import NotificationPanel, { Notification } from "./NotificationPanel";
import { useAuth } from "@/hooks/useAuth";
import { i } from "framer-motion/m";

const demoNotifications: Notification[] = [
  {
    id: 1,
    title: "Your analysis has completed",
    message: "The data analysis job you started is now ready to view.",
    time: "Just now",
    type: "success",
    read: false
  },
  {
    id: 2,
    title: "New comment on your report",
    message: "Sarah Johnson left a comment on your monthly analytics report.",
    time: "2 hours ago",
    type: "info",
    read: false
  },
  {
    id: 3,
    title: "Storage limit alert",
    message: "You've used 85% of your storage quota. Consider upgrading your plan.",
    time: "Yesterday",
    type: "warning",
    read: true
  },
  {
    id: 4,
    title: "Team meeting",
    message: "Reminder: Weekly team meeting in 30 minutes.",
    time: "Today at 3:00 PM",
    type: "event",
    read: true
  }
];
interface NavbarProps {
  toggleSidebar: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    firstName?: string; // Add firstName property
    lastName?: string;  // Add lastName for consistency
    picture?: string;   // Add picture as alternative to avatar
    role?: string;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  className,
  user = null,
  onLogin,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  // Get both authentication status and user data from the hook
  const { isAuthenticated, userData, handleLogout } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLoginSuccess = () => {
    if (onLogin) {
      onLogin();
    }
    setIsLoginModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      await handleLogout(() => {
        if (onLogout) {
          onLogout();
        }
        setIsLogoutModalOpen(false);
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  // Animation variants
  const iconButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const notificationBadgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 15 }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  const userIsAuthenticated = user !== null || isAuthenticated === true;

  const effectiveUser = user || userData || null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "h-16 border-b shadow-sm bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800",
          className
        )}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section with logo and toggle */}
          <div className="flex items-center">
            <motion.button
              whileHover={iconButtonVariants.hover}
              whileTap={iconButtonVariants.tap}
              className="block md:!hidden p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              onClick={toggleSidebar}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block ml-4 font-medium text-gray-800 dark:text-gray-200"
            >
              Dashboard
            </motion.div>
          </div>

          {/* Center section with search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:flex relative max-w-md w-96"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </motion.div>

          {/* Right section with actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile search button */}
            <motion.button
              whileHover={iconButtonVariants.hover}
              whileTap={iconButtonVariants.tap}
              className="block md:!hidden p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Notification button */}
            <motion.button
              whileHover={iconButtonVariants.hover}
              whileTap={iconButtonVariants.tap}
              className="p-1.5 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              onClick={() => setIsNotificationPanelOpen(true)}
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadNotificationsCount > 0 && (
                  <motion.span
                    variants={notificationBadgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full"
                  >
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Theme toggle button */}
            <motion.button
              whileHover={iconButtonVariants.hover}
              whileTap={iconButtonVariants.tap}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* User menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 rounded-full p-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
              >
                <span className="sr-only">Open user menu</span>
                {userIsAuthenticated && effectiveUser ? (
                  <img
                    src={user?.avatar || userData?.picture || ''}
                    alt={effectiveUser.firstName || effectiveUser.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <ChevronDown className="h-4 w-4 mr-1 hidden sm:block text-gray-500 dark:text-gray-400" />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 bg-white dark:bg-gray-800"
                  >
                    {userIsAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {effectiveUser?.firstName || effectiveUser?.name || "User"}
                          </p>
                          <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                            {effectiveUser?.email || "user@example.com"}
                          </p>
                        </div>

                        <Link href="/menu/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </div>
                        </Link>

                        <motion.button
                          whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
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
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
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
                        </motion.button>

                        <motion.div whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}>
                          <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                            <div className="flex items-center">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Create account
                            </div>
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        darkMode={theme === 'dark'}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
        darkMode={theme === 'dark'}
      />

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        isDark={theme === 'dark'}
        onMarkAllAsRead={handleMarkAllAsRead}
        onViewAll={() => {
          setIsNotificationPanelOpen(false);
          console.log('View all notifications');
        }}
      />
    </>
  );
};

export default Navbar;