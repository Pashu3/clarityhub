"use client";

import React from "react";
import { Bell, X, CheckCircle2, AlertTriangle, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'event';
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isDark: boolean;
  onMarkAllAsRead: () => void;
  onViewAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  notifications,
  isDark,
  onMarkAllAsRead,
  onViewAll
}) => {
  // Get notification icon by type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'info':
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 z-50 shadow-xl w-full sm:w-96 max-w-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs py-0.5 px-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h2>
                <div className="flex space-x-2">
                  <motion.button 
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close notifications"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
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
                    className="divide-y divide-gray-100 dark:divide-gray-800"
                  >
                    {notifications.map(notification => (
                      <motion.div 
                        key={notification.id}
                        variants={{
                          hidden: { opacity: 0, x: 50 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className={`p-4 ${notification.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                        whileHover={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(243, 244, 246, 1)' }}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                              {!notification.read && (
                                <motion.div 
                                  className="h-2 w-2 rounded-full bg-blue-500"
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7],
                                    transition: { repeat: Infinity, duration: 2 }
                                  }}
                                ></motion.div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                      <Bell className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-center">You're all caught up!</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                      We'll notify you when something new arrives
                    </p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <motion.button 
                    className="w-full py-2 px-4 rounded-lg text-sm text-center text-white bg-blue-600 hover:bg-blue-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onMarkAllAsRead}
                  >
                    Mark all as read
                  </motion.button>
                  <motion.button 
                    className="w-full mt-2 py-2 px-4 rounded-lg text-sm text-center text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewAll}
                  >
                    View all notifications
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop for notification panel on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationPanel;