"use client";

import React, { useRef } from "react";
import { Bell, X, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isDark: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  notifications,
  isDark
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
      case 'info':
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

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
            <div className="h-full bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <div className="flex space-x-2">
                  <motion.button 
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                    className="divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    {notifications.map(notification => (
                      <motion.div 
                        key={notification.id}
                        variants={{
                          hidden: { opacity: 0, x: 50 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className={`p-4 ${notification.read ? '' : 'bg-purple-50/50 dark:bg-purple-900/10'}`}
                        whileHover={{ backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(243, 244, 246, 1)' }}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                              {!notification.read && (
                                <motion.div 
                                  className="h-2 w-2 rounded-full bg-purple-500"
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    transition: { repeat: Infinity, duration: 2 }
                                  }}
                                ></motion.div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Bell className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No notifications</p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <motion.button 
                    className="w-full py-2 px-4 rounded-lg text-sm text-center text-white bg-purple-600 hover:bg-purple-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Mark all as read
                  </motion.button>
                  <motion.button 
                    className="w-full mt-2 py-2 px-4 rounded-lg text-sm text-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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