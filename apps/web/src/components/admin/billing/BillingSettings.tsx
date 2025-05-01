"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Receipt,
  DollarSign,
  CalendarClock,
  Edit,
  PlusCircle,
  X
} from "lucide-react";

interface BillingSettingsProps {}

const BillingSettings: React.FC<BillingSettingsProps> = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Billing Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Settings className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Billing Preferences
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Auto-Renew Subscription</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically renew your subscription when it expires</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Billing Cycle</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose how often you're billed</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Monthly</option>
              <option selected>Annual (Save 20%)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Invoice Generation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">When to generate and send invoices</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>On payment date</option>
              <option selected>7 days before payment</option>
              <option>14 days before payment</option>
              <option>30 days before payment</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Payment Reminder Emails</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send email reminders before charging</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Invoice Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Receipt className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Invoice Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Invoice Recipients</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Who should receive invoice emails</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                <span className="text-sm">billing@clarityhub.com</span>
                <button className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={14} />
                </button>
              </div>
              <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <PlusCircle size={14} className="mr-1 inline-block" />
                Add
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Invoice Format</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose your preferred invoice format</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option selected>PDF</option>
              <option>HTML</option>
              <option>CSV</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Invoice Numbering</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Format for invoice numbers</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option selected>INV-YYYY-###</option>
              <option>YYYY-MM-###</option>
              <option>INV###</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Company Information</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information displayed on invoices</p>
            </div>
            <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <Edit size={14} className="mr-1 inline-block" />
              Edit
            </button>
          </div>
        </div>
      </div>
      
      {/* Tax Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <DollarSign className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Tax Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Tax ID</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your business tax identification number</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-900 dark:text-white mr-2">US 98-7654321</span>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Edit size={14} />
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Tax Rate</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Default tax rate for invoices</p>
            </div>
            <div className="flex items-center">
              <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
                <option selected>None (0%)</option>
                <option>US Sales Tax (Varies by state)</option>
                <option>EU VAT (Varies by country)</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Tax Exemption</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload tax exemption certificate</p>
            </div>
            <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              Upload Certificate
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <CalendarClock className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Payment Notifications
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Payment Confirmation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive email confirmation when payment processes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Payment Failure</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive notification when payment fails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Renewal Reminder</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Days before renewal to send reminder</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>None</option>
              <option>1 day before</option>
              <option selected>7 days before</option>
              <option>14 days before</option>
              <option>30 days before</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Price Change Notification</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get notified about upcoming price changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Save settings button */}
      <div className="flex justify-end">
        <motion.button 
          className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Billing Settings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BillingSettings;