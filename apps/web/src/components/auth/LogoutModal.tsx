"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  darkMode?: boolean;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  darkMode = false,
}: LogoutModalProps) {
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
          className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-5">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>

            <div className="pt-2 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <LogOut size={24} className="text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-lg font-medium mb-2">Sign out</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Are you sure you want to sign out? You will need to sign in again to access your account.
              </p>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-lg border text-sm font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center",
                  isLoading
                    ? "bg-red-500 opacity-70 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Signing out...
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}