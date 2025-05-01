"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
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

interface ExportItem {
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
}

interface ExportHistoryProps {
  exportHistory: ExportItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  itemsPerPage: number;
  paginatedItems: ExportItem[];
  totalPages: number;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
}

const ExportHistory: React.FC<ExportHistoryProps> = ({
  exportHistory,
  currentPage,
  setCurrentPage,
  searchQuery,
  itemsPerPage,
  paginatedItems,
  totalPages,
  showExportModal,
  setShowExportModal
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
      key="export"
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
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Format</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Records</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Size</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
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
                    {paginatedItems.map((export_: ExportItem) => (
                      <motion.tr 
                        key={export_.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        variants={itemVariants}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{export_.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{export_.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                            {getFormatIcon(export_.format)}
                            {export_.format}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {export_.records}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {export_.size}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700 dark:text-slate-300">{export_.date}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{export_.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(export_.status)}`}>
                            {export_.status === 'Completed' && <Check size={12} className="mr-1" />}
                            {export_.status === 'Failed' && <X size={12} className="mr-1" />}
                            {export_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {export_.requestedBy}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {export_.status === 'Completed' && (
                            <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                              Download
                            </button>
                          )}
                          <button className="text-sm px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.div>
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <p className="font-medium mb-1">No exports found</p>
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
        {exportHistory.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, exportHistory.length)} of {exportHistory.length} exports
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
        
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                <Download className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                Export Data
              </h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Export Name
                </label>
                <input 
                  type="text" 
                  placeholder="Enter export name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Data Type
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <option>Customers</option>
                  <option>Transactions</option>
                  <option>Products</option>
                  <option>Users</option>
                  <option>Activity</option>
                  <option>Support</option>
                  <option>Inventory</option>
                  <option>Analytics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="format" className="w-4 h-4 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" defaultChecked />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">CSV</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="w-4 h-4 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">XLSX</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="w-4 h-4 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">JSON</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date Range
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <option>All time</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 12 months</option>
                  <option>Custom range</option>
                </select>
              </div>
              
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="include-deleted"
                    name="include-deleted"
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="include-deleted" className="text-sm text-slate-700 dark:text-slate-300">
                    Include deleted records
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Start Export
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ExportHistory;