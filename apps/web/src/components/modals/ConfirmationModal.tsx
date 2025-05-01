"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "danger" | "success";
  icon?: React.ReactNode;
  isLoading?: boolean;
  darkMode?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  icon,
  isLoading = false,
  darkMode = false,
}: ConfirmationModalProps) {
  // Define color schemes based on type
  const getColorScheme = () => {
    switch (type) {
      case "warning":
        return {
          iconBg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
          iconColor: darkMode ? "text-amber-400" : "text-amber-600",
          buttonBg: darkMode ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-500 hover:bg-amber-600",
        };
      case "danger":
        return {
          iconBg: darkMode ? "bg-red-900/30" : "bg-red-100",
          iconColor: darkMode ? "text-red-400" : "text-red-600",
          buttonBg: darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600",
        };
      case "success":
        return {
          iconBg: darkMode ? "bg-green-900/30" : "bg-green-100",
          iconColor: darkMode ? "text-green-400" : "text-green-600",
          buttonBg: darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600",
        };
      case "info":
      default:
        return {
          iconBg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
          iconColor: darkMode ? "text-blue-400" : "text-blue-600",
          buttonBg: darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const colorScheme = getColorScheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`w-full max-w-sm rounded-xl shadow-xl overflow-hidden ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-5">
            <button
              onClick={onClose}
              className={`absolute right-4 top-4 p-1 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X size={18} className="text-gray-500" />
            </button>

            <div className="pt-2 text-center">
              {icon && (
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${colorScheme.iconBg} mb-4`}>
                  <div className={colorScheme.iconColor}>{icon}</div>
                </div>
              )}

              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                {message}
              </p>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={onClose}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium
                  ${isLoading
                    ? `${colorScheme.buttonBg.split(' ')[0]} opacity-70 cursor-not-allowed`
                    : colorScheme.buttonBg
                  } transition-colors flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}