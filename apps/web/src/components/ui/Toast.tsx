"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const iconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColorMap = {
    success: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
  };

  const textColorMap = {
    success: "text-green-800 dark:text-green-400",
    error: "text-red-800 dark:text-red-400",
    info: "text-blue-800 dark:text-blue-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${bgColorMap[type]} max-w-md`}
    >
      <div className="flex items-center">
        <div className="mr-3">{iconMap[type]}</div>
        <div className={`flex-1 ${textColorMap[type]}`}>{message}</div>
        <button onClick={onClose} className={`ml-3 ${textColorMap[type]} hover:opacity-70`}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};