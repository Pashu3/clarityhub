"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Loader2, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  darkMode?: boolean;
}

export default function AdminLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  darkMode = false,
}: AdminLogoutModalProps) {
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
          className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-5">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={18} className="text-slate-500 dark:text-slate-400" />
            </button>

            <div className="pt-2 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />
              </div>

              <div className="flex items-center justify-center mb-3">
                <h3 className="text-lg font-medium">Exit Admin Panel</h3>
                <div className="ml-2 flex items-center px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-semibold">
                  <Shield className="h-3 w-3 mr-1" />
                  ADMIN
                </div>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                You are about to exit the administrative panel. Your privileged session will end, and you'll need to authenticate again to regain admin access.
              </p>
            </div>

            <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-lg border text-sm font-medium border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "py-2 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center",
                  isLoading
                    ? "bg-purple-600 opacity-70 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Exiting admin...
                  </>
                ) : (
                  "Confirm Exit"
                )}
              </button>
            </div>
            
            <div className="mt-4 p-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <LogOut size={12} className="mr-1.5 text-slate-400" />
                Returning to standard user interface
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}