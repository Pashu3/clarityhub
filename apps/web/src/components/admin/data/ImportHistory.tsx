"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Check, 
  X, 
  ChevronLeft,
  ChevronRight,
  Table,
  FileSpreadsheet,
  FileJson,
  FileText
} from "lucide-react";

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

interface ImportItem {
  id: string;
  name: string;
  type: string;
  format: string;
  size: string;
  records: string;
  status: string;
  date: string;
  time: string;
  requestedBy: string;
  success: number;
  failed: number;
}

interface ImportHistoryProps {
  importHistory: ImportItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  itemsPerPage: number;
  paginatedItems: ImportItem[];
  totalPages: number;
}

const ImportHistory: React.FC<ImportHistoryProps> = ({
  importHistory,
  currentPage,
  setCurrentPage,
  searchQuery,
  itemsPerPage,
  paginatedItems,
  totalPages
}) => {
  
  // Helper function to get format icon
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'CSV':
        return <Table size={16} className="mr-2 text-green-500 dark:text-green-400" />;
      case 'XLSX':
        return <FileSpreadsheet size={16} className="mr-2 text-blue-500 dark:text-blue-400" />;
      case 'JSON':
        return <FileJson size={16} className="mr-2 text-amber-500 dark:text-amber-400" />;
      default:
        return <FileText size={16} className="mr-2 text-slate-500 dark:text-slate-400" />;
    }
  };

  // Helper function to get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Completed With Errors':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      key="import"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          New Import
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Format</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Records</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Success/Failed</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <AnimatePresence>
                {paginatedItems.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    component={null}
                  >
                    {paginatedItems.map((import_: ImportItem) => (
                      <motion.tr 
                        key={import_.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        variants={itemVariants}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{import_.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{import_.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                            {getFormatIcon(import_.format)}
                            {import_.format}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {import_.records}
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{import_.size}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700 dark:text-slate-300">{import_.date}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{import_.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(import_.status)}`}>
                            {import_.status === 'Completed' && <Check size={12} className="mr-1" />}
                            {import_.status === 'Failed' && <X size={12} className="mr-1" />}
                            {import_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                            <span className="text-green-600 dark:text-green-400 font-medium">{import_.success}</span>
                            <span className="mx-1">/</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">{import_.failed}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {import_.requestedBy}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-sm px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            View Log
                          </button>
                          {import_.status === 'Failed' && (
                            <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                              Retry
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </motion.div>
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <p className="font-medium mb-1">No imports found</p>
                        <p className="text-sm">No data matching your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {importHistory.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, importHistory.length)} of {importHistory.length} imports
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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

export default ImportHistory;