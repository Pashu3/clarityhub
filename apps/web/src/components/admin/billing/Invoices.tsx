"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Download,
  ChevronLeft,
  ChevronRight
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

// Helper for status badge styling
const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'pending':
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'failed':
    case 'canceled':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
  }
};

interface InvoicesProps {
  paginatedItems: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    paymentMethod: string;
    billingPeriod: string;
  }>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredInvoices: Array<any>;
  itemsPerPage: number;
}

export default function Invoices({
  paginatedItems,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredInvoices,
  itemsPerPage
}: InvoicesProps) {
  return (
    <motion.div
      key="invoices"
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
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Payment Method</th>
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
                    {paginatedItems.map((invoice: any, index: number) => (
                      <motion.tr 
                        key={invoice.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        variants={itemVariants}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{invoice.id}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{invoice.billingPeriod}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(invoice.status)}`}>
                            {invoice.status === 'Paid' && <CheckCheck size={12} className="mr-1" />}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {invoice.paymentMethod}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-sm px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            View
                          </button>
                          <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                            <Download size={14} className="inline mr-1" />
                            PDF
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.div>
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <p className="font-medium mb-1">No invoices found</p>
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
        {filteredInvoices.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
}