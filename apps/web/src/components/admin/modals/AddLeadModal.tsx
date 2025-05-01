"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  BarChart,
  Calendar
} from "lucide-react";

export interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  value: string;
  notes: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: LeadData) => Promise<void>;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  // Default status options
  const statusOptions = [
    "New", 
    "Contacted", 
    "Qualified", 
    "Proposal", 
    "Negotiation", 
    "Closed Won", 
    "Closed Lost"
  ];
  
  // Default source options
  const sourceOptions = [
    "Website", 
    "Referral", 
    "LinkedIn", 
    "Conference", 
    "Webinar", 
    "Partner",
    "Cold Call",
    "Other"
  ];
  
  // Form state
  const [formData, setFormData] = useState<LeadData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "New",
    source: "Website",
    value: "",
    notes: ""
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "New",
        source: "Website",
        value: "",
        notes: ""
      });
      setErrors({});
      setIsSubmitting(false);
      setSubmitSuccess(false);
    }
  }, [isOpen]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for value field to ensure proper formatting
    if (name === "value" && value) {
      // Remove any non-numeric characters except decimal point
      let numericValue = value.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const decimalPoints = numericValue.match(/\./g)?.length || 0;
      if (decimalPoints > 1) {
        numericValue = numericValue.substr(0, numericValue.lastIndexOf('.'));
      }
      
      // Format with dollar sign
      if (numericValue) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: numericValue.startsWith('$') ? numericValue : `$${numericValue}` 
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }
    
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.phone.trim() && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    
    if (!formData.source) {
      newErrors.source = "Source is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddLead(formData);
      setSubmitSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to add lead:", error);
      setErrors(prev => ({ ...prev, form: "Failed to add lead. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Add New Lead
                </h2>
                <motion.button 
                  className="p-1 rounded-full text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                {submitSuccess ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Lead Added Successfully</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center">
                      {formData.name} from {formData.company} has been added to your leads
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {errors.form && (
                      <motion.div 
                        className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{errors.form}</span>
                      </motion.div>
                    )}
                    
                    <div className="space-y-4">
                      {/* Basic Information Section */}
                      <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                          Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Contact Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.name 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                                placeholder="John Smith"
                              />
                            </div>
                            {errors.name && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.name}
                              </motion.p>
                            )}
                          </div>
                          
                          {/* Company field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.company 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                                placeholder="Acme Inc."
                              />
                            </div>
                            {errors.company && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.company}
                              </motion.p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Email field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.email 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                                placeholder="john@example.com"
                              />
                            </div>
                            {errors.email && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.email}
                              </motion.p>
                            )}
                          </div>
                          
                          {/* Phone field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Phone Number
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.phone 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                                placeholder="+1 (123) 456-7890"
                              />
                            </div>
                            {errors.phone && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.phone}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Lead Details Section */}
                      <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                          Lead Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Status field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Status <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.status 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                              >
                                {statusOptions.map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </div>
                            {errors.status && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.status}
                              </motion.p>
                            )}
                          </div>
                          
                          {/* Source field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Source <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BarChart className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <select
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.source 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                              >
                                {sourceOptions.map(source => (
                                  <option key={source} value={source}>{source}</option>
                                ))}
                              </select>
                            </div>
                            {errors.source && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.source}
                              </motion.p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          {/* Value field */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                              Estimated Value
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <input
                                type="text"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                                  errors.value 
                                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                                placeholder="$10,000"
                              />
                            </div>
                            {errors.value && (
                              <motion.p 
                                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {errors.value}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Notes Section */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Notes
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="Add any relevant notes about this lead..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Footer */}
              {!submitSuccess && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding Lead...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Add Lead
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddLeadModal;