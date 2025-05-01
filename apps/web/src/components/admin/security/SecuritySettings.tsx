"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Key, 
  ShieldCheck, 
  Users, 
  Database 
} from "lucide-react";

interface SecuritySettingsProps {}

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Password Policy Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Key className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Password Policy
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Minimum password length</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Require at least this many characters</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>8 characters</option>
              <option selected>12 characters</option>
              <option>16 characters</option>
            </select>
          </div>
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Require complexity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Password must include uppercase, lowercase, number, and special character</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Password expiration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Force users to reset passwords periodically</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Never</option>
              <option>30 days</option>
              <option selected>90 days</option>
              <option>180 days</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Password history</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Prevent reuse of recent passwords</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>None</option>
              <option>Last 3 passwords</option>
              <option selected>Last 5 passwords</option>
              <option>Last 10 passwords</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Account lockout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lock account after failed login attempts</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Disabled</option>
              <option>After 3 attempts</option>
              <option selected>After 5 attempts</option>
              <option>After 10 attempts</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Multi-Factor Authentication Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <ShieldCheck className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Multi-Factor Authentication
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Require MFA for all users</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Force all users to set up 2FA for their accounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Allowed MFA methods</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select which 2FA methods are available</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="mfa-app" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="mfa-app" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Authenticator app</label>
              </div>
              <div className="flex items-center">
                <input id="mfa-sms" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="mfa-sms" className="ml-2 text-sm text-slate-700 dark:text-slate-300">SMS</label>
              </div>
              <div className="flex items-center">
                <input id="mfa-email" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="mfa-email" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Email</label>
              </div>
              <div className="flex items-center">
                <input id="mfa-security-key" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="mfa-security-key" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Security key</label>
              </div>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">MFA frequency</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How often to require MFA verification</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Every login</option>
              <option selected>Every 30 days</option>
              <option>Every 60 days</option>
              <option>Every 90 days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Session Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Session Security
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Session timeout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Auto-logout after inactivity period</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option selected>1 hour</option>
              <option>2 hours</option>
              <option>4 hours</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Concurrent sessions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum number of active sessions per user</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>1 session (force logout others)</option>
              <option>3 sessions</option>
              <option selected>5 sessions</option>
              <option>Unlimited</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">IP binding</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Invalidate session if IP address changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* API Security */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Database className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          API Security
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">API key expiration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically expire API keys after period</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Never</option>
              <option>30 days</option>
              <option selected>90 days</option>
              <option>180 days</option>
              <option>1 year</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Rate limiting</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Limit API requests per minute</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Disabled</option>
              <option>60 requests/minute</option>
              <option selected>100 requests/minute</option>
              <option>500 requests/minute</option>
              <option>1000 requests/minute</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">IP restrictions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Restrict API access to specific IP addresses</p>
            </div>
            <button className="px-3 py-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              Configure IPs
            </button>
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
          Save Security Settings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;