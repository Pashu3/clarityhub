"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  MessageSquareDashed, 
  Inbox, 
  Mail, 
  Settings 
} from "lucide-react";

interface SupportSettingsProps {}

export default function SupportSettings({}: SupportSettingsProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Support Hours */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Clock className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Support Hours & Availability
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Email Support Hours</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hours when email support is available</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>24/7 Support</option>
              <option selected>Business Hours (9 AM - 6 PM EST)</option>
              <option>Extended Hours (8 AM - 8 PM EST)</option>
              <option>Custom Hours</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Live Chat Availability</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">When live chat support is available</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>24/7 Support</option>
              <option selected>Business Days (9 AM - 6 PM EST)</option>
              <option>Extended Hours (8 AM - 8 PM EST)</option>
              <option>Disabled</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Response Time Target</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Target time to first response</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>1 hour</option>
              <option selected>4 hours</option>
              <option>8 hours</option>
              <option>24 hours</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Weekend Support</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Allow support requests on weekends</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Automated Responses */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <MessageSquareDashed className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Automated Responses
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Auto-acknowledgment</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send automatic confirmation when ticket is received</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Knowledge Base Suggestions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Suggest relevant articles based on ticket content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">AI-powered responses</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use AI to suggest replies to common questions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Ticket Management */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Inbox className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Ticket Management
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Auto-categorization</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically categorize tickets based on content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Auto-assignment</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically assign tickets to support staff</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Disabled</option>
              <option>Round Robin</option>
              <option selected>Based on category</option>
              <option>Workload balanced</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Auto-close tickets</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Close tickets with no activity after period</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Disabled</option>
              <option>After 3 days</option>
              <option selected>After 7 days</option>
              <option>After 14 days</option>
              <option>After 30 days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Mail className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Notification Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Email notifications</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send email for new tickets and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Slack integration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send notifications to Slack channel</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Notification for high priority tickets</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Additional alerts for urgent issues</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Standard notifications only</option>
              <option>Email + in-app</option>
              <option selected>Email + in-app + SMS</option>
              <option>Email + in-app + SMS + phone call</option>
            </select>
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
          Save Support Settings
        </motion.button>
      </div>
    </motion.div>
  );
}