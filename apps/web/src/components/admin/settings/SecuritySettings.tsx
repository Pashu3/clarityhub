"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield, X, Trash2, Edit, Copy } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  scopes: string[];
}

interface SecurityProps {
  apiKeys: ApiKey[];
}

export default function Security({ apiKeys }: SecurityProps) {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Authentication Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Lock className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Authentication Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Require 2FA for all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Single Sign-On (SSO)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enable SSO authentication</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Password Policy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Minimum password requirements</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="basic">Basic (8+ characters)</option>
              <option value="moderate">Moderate (8+ chars, 1 number)</option>
              <option value="strong" selected>Strong (8+ chars, 1 number, 1 special)</option>
              <option value="very-strong">Very Strong (12+ chars, mixed case, numbers, special)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Password Expiration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How often users must change passwords</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>Never</option>
              <option>30 days</option>
              <option selected>90 days</option>
              <option>180 days</option>
              <option>365 days</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Session Timeout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long until inactive users are logged out</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option selected>1 hour</option>
              <option>2 hours</option>
              <option>4 hours</option>
              <option>8 hours</option>
              <option>24 hours</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Login Attempts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum failed login attempts before lockout</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>3 attempts</option>
              <option selected>5 attempts</option>
              <option>10 attempts</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* API Access */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Shield className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            API Keys
          </h2>
          <button className="px-3 py-1.5 text-sm rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center">
            <Plus size={14} className="mr-1" />
            Add API Key
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Key</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Used</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Scopes</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                    {key.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-mono">
                    {key.key}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {key.created}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {key.lastUsed}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((scope, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded">
                      <Copy size={14} />
                    </button>
                    <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded">
                      <Edit size={14} />
                    </button>
                    <button className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Content Security */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Shield className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Content Security
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">File Upload Restrictions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Allowed file types for uploads</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2 w-64">
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                .jpg, .png, .gif
                <button className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={14} />
                </button>
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                .pdf, .doc, .docx
                <button className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={14} />
                </button>
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                .csv, .xlsx
                <button className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={14} />
                </button>
              </span>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Maximum File Size</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum file upload size</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>5 MB</option>
              <option>10 MB</option>
              <option selected>25 MB</option>
              <option>50 MB</option>
              <option>100 MB</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Content Scanning</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scan uploaded files for malware</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">CORS Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cross-Origin Resource Sharing domains</p>
            </div>
            <div className="w-64">
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                rows={3}
                defaultValue="https://clarityhub.com
https://app.clarityhub.com
https://api.clarityhub.com"
              ></textarea>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Content Delivery Network</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CDN for static assets</p>
            </div>
            <input 
              type="text"
              defaultValue="https://cdn.clarityhub.com"
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Adding the Plus icon that was missing in the imports
function Plus(props: { size: number; className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size} 
      height={props.size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}