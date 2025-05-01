"use client";
import React from "react";
import { motion } from "framer-motion";
import { Settings, Globe, Mail, UploadCloud, ExternalLink } from "lucide-react";

interface GeneralSettingsProps {
  maintenanceMode: boolean;
  setMaintenanceMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  timeZone: string;
  setTimeZone: React.Dispatch<React.SetStateAction<string>>;
  dateFormat: string;
  setDateFormat: React.Dispatch<React.SetStateAction<string>>;
}

export default function GeneralSettings({
  maintenanceMode,
  setMaintenanceMode,
  selectedLanguage,
  setSelectedLanguage,
  timeZone,
  setTimeZone,
  dateFormat,
  setDateFormat
}: GeneralSettingsProps) {
  return (
    <motion.div
      key="general"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Application Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Settings className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Application Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Application Name</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The name of your application instance</p>
            </div>
            <input 
              type="text"
              defaultValue="ClarityHub"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Application URL</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The main URL of your application</p>
            </div>
            <input 
              type="text"
              defaultValue="https://app.clarityhub.com"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Application Logo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your application logo (recommended size: 300x300px)</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Update
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Maintenance Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Put application in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={maintenanceMode}
                onChange={() => setMaintenanceMode(!maintenanceMode)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          {maintenanceMode && (
            <div className="py-4">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Maintenance Message</h3>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={3}
                defaultValue="We're currently performing maintenance on our servers. We'll be back shortly. Thank you for your patience."
              ></textarea>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This message will be displayed to users during maintenance mode.</p>
            </div>
          )}
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">System Status Page</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Public system status page URL</p>
            </div>
            <div className="flex items-center">
              <input 
                type="text"
                defaultValue="https://status.clarityhub.com"
                className="w-64 px-3 py-2 rounded-l-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-r-0"
              />
              <button className="p-2 rounded-r-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Regional Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Globe className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Regional Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Default Language</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Primary language for the application</p>
            </div>
            <select 
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Time Zone</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Default time zone for displaying dates and times</p>
            </div>
            <select 
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London, Edinburgh (GMT)</option>
              <option value="Europe/Paris">Paris, Berlin, Rome, Madrid</option>
              <option value="Asia/Tokyo">Tokyo, Osaka</option>
              <option value="Australia/Sydney">Sydney, Melbourne</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Date Format</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How dates are displayed throughout the application</p>
            </div>
            <select 
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (04/27/2025)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (27/04/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-04-27)</option>
              <option value="MMMM D, YYYY">MMMM D, YYYY (April 27, 2025)</option>
              <option value="D MMMM YYYY">D MMMM YYYY (27 April 2025)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">First Day of Week</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Starting day for calendars and reports</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Mail className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Contact Information
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Support Email</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Email address for customer support inquiries</p>
            </div>
            <input 
              type="email"
              defaultValue="support@clarityhub.com"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Admin Email</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Email address for system notifications</p>
            </div>
            <input 
              type="email"
              defaultValue="admin@clarityhub.com"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Help Documentation URL</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Link to help documentation</p>
            </div>
            <input 
              type="url"
              defaultValue="https://docs.clarityhub.com"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">System Notification Sender</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Name shown on system notification emails</p>
            </div>
            <input 
              type="text"
              defaultValue="ClarityHub System"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}