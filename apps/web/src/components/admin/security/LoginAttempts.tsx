"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05 
    } 
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

interface LoginAttemptsProps {
  paginatedItems: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredLoginAttempts: any[];
  itemsPerPage: number;
  getStatusBadgeStyles: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const LoginAttempts: React.FC<LoginAttemptsProps> = ({
  paginatedItems,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredLoginAttempts,
  itemsPerPage,
  getStatusBadgeStyles,
  getStatusIcon
}) => {
  return (
    <motion.div
      key="loginAttempts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Time</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Device</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((attempt: any) => (
                  <motion.tr 
                    key={attempt.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{attempt.user}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{attempt.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(attempt.status)}`}>
                        {getStatusIcon(attempt.status)}
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 dark:text-slate-300">{attempt.time}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{attempt.date}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {attempt.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {attempt.device}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {attempt.reason || '-'}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    <div>
                      <p className="font-medium mb-1">No login attempts found</p>
                      <p className="text-sm">No data matching your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredLoginAttempts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLoginAttempts.length)} of {filteredLoginAttempts.length} attempts
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                <ChevronLeft size={16} />
              </motion.button>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </div>
              <motion.button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LoginAttempts;