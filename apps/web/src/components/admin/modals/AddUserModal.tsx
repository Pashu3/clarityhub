"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, User, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: UserData) => Promise<void>;
}

export interface UserData {
  name: string;
  email: string;
  role: string;
  sendInvite: boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  // Form state
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    role: "User",
    sendInvite: true
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
        email: "",
        role: "User",
        sendInvite: true
      });
      setErrors({});
      setIsSubmitting(false);
      setSubmitSuccess(false);
    }
  }, [isOpen]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
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
      await onAddUser(formData);
      setSubmitSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to add user:", error);
      setErrors(prev => ({ ...prev, form: "Failed to add user. Please try again." }));
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Add New User
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
              <div className="p-6">
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
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">User Added Successfully</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center">
                      {formData.sendInvite 
                        ? `An invitation email has been sent to ${formData.email}`
                        : `${formData.name} has been added as a ${formData.role.toLowerCase()}`
                      }
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
                      {/* Name field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name
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
                      
                      {/* Role field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          User Role
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                              errors.role 
                                ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                                : 'border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500'
                            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                          >
                            <option value="User">User</option>
                            <option value="Editor">Editor</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        {errors.role && (
                          <motion.p 
                            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.role}
                          </motion.p>
                        )}
                      </div>
                      
                      {/* Send invite checkbox */}
                      <div className="flex items-center">
                        <input
                          id="sendInvite"
                          name="sendInvite"
                          type="checkbox"
                          checked={formData.sendInvite}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="sendInvite" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                          Send an invitation email
                        </label>
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
                        Adding User...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
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

export default AddUserModal;