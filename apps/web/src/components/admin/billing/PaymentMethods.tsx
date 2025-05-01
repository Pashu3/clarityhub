"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  PlusCircle,
  Landmark,
  CheckCircle,
  MoreVertical,
  Pencil,
  Trash,
  XCircle
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

interface PaymentMethodsProps {
  paginatedItems: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredInvoices: any[];
  itemsPerPage: number;
}

export default function PaymentMethods({
  paginatedItems,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredInvoices,
  itemsPerPage
}: PaymentMethodsProps) {
  
  // Card brand icon component
  const CardBrandIcon = ({ brand }: { brand: string }) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return <div className="text-blue-600 font-semibold text-xs">VISA</div>;
      case 'mastercard':
        return <div className="text-orange-600 font-semibold text-xs">MASTERCARD</div>;
      case 'amex':
        return <div className="text-blue-500 font-semibold text-xs">AMEX</div>;
      case 'discover':
        return <div className="text-orange-500 font-semibold text-xs">DISCOVER</div>;
      default:
        return <CreditCard size={16} className="text-slate-500" />;
    }
  };

  // Bank icon component
  const BankIcon = () => (
    <Landmark size={16} className="text-slate-700 dark:text-slate-300" />
  );
  
  return (
    <motion.div
      key="payment-methods"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Action buttons */}
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center">
          <PlusCircle size={16} className="mr-2" />
          Add Payment Method
        </button>
      </div>
      
      {/* Payment methods list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {paginatedItems.length > 0 ? (
          paginatedItems.map((method: any) => (
            <motion.div
              key={method.id}
              variants={itemVariants}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
            >
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {method.type === 'card' ? (
                      <CardBrandIcon brand={method.brand} />
                    ) : (
                      <BankIcon />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {method.type === 'card' 
                          ? `${method.brand} •••• ${method.last4}` 
                          : `${method.bank_name} •••• ${method.last4}`}
                      </h3>
                      {method.isDefault && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {method.type === 'card' 
                        ? `Expires ${method.expMonth}/${method.expYear}` 
                        : 'Bank Account (ACH)'}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <MoreVertical size={16} className="text-slate-500 dark:text-slate-400" />
                  </button>
                  
                  {/* Dropdown menu would go here */}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {method.billingAddress.line1}, {method.billingAddress.city}, {method.billingAddress.state} {method.billingAddress.postal_code}
                </div>
                
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button className="text-xs px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                      Set Default
                    </button>
                  )}
                  <button className="text-xs px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                    <Pencil size={12} className="inline mr-1" />
                    Edit
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <Trash size={12} className="inline mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <CreditCard size={20} className="text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">No payment methods</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              You don't have any payment methods set up yet.
            </p>
            <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center">
              <PlusCircle size={16} className="mr-2" />
              Add Payment Method
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Pagination */}
      {paginatedItems.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </motion.div>
  );
}