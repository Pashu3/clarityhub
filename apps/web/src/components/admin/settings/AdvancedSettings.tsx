"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Database, FileText, DownloadCloud, UploadCloud } from "lucide-react";

interface AdvancedProps {
  debugMode: boolean;
  setDebugMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleClearCache: () => void;
  handleSystemRestart: () => void;
}

export default function Advanced({ 
  debugMode, 
  setDebugMode, 
  handleClearCache, 
  handleSystemRestart 
}: AdvancedProps) {
  return (
    <motion.div
      key="advanced"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* System Performance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Zap className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          System Performance
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Debug Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enable detailed logging and error messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={debugMode}
                onChange={() => setDebugMode(!debugMode)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Cache Control</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure application caching</p>
            </div>
            <div className="flex items-center space-x-3">
              <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                <option>Disabled</option>
                <option>Minimal</option>
                <option selected>Standard</option>
                <option>Aggressive</option>
              </select>
              <button 
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                onClick={handleClearCache}
              >
                Clear Cache
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Query Optimization</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Database query optimization level</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>Basic</option>
              <option selected>Standard</option>
              <option>Advanced</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Resource Limits</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum memory usage for the application</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>256 MB</option>
              <option>512 MB</option>
              <option selected>1 GB</option>
              <option>2 GB</option>
              <option>4 GB</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">System Restart</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Restart the application server</p>
            </div>
            <button 
              className="px-3 py-2 text-sm rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleSystemRestart}
            >
              Restart System
            </button>
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Database className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Data Management
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Automatic Backups</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule regular database backups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Backup Frequency</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How often to run backups</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>Hourly</option>
              <option selected>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Backup Retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep backups</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>7 days</option>
              <option selected>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Export/Import Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage data export and import</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <DownloadCloud size={14} className="mr-1 inline-block" />
                Export
              </button>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Import
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Database Migration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Run database migrations</p>
            </div>
            <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              Run Migrations
            </button>
          </div>
        </div>
      </div>
      
      {/* Logging & Monitoring */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Logging & Monitoring
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Log Level</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Verbosity of application logs</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>Error Only</option>
              <option>Warning</option>
              <option selected>Info</option>
              <option>Debug</option>
              <option>Trace</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Log Retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep system logs</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option>7 days</option>
              <option selected>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Audit Logs</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Record user activity in audit logs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">External Monitoring</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect to external monitoring services</p>
            </div>
            <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              Configure
            </button>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Download Logs</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Download system logs for analysis</p>
            </div>
            <div className="flex space-x-2">
              <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                <option>Application Logs</option>
                <option>Error Logs</option>
                <option>Audit Logs</option>
                <option>Security Logs</option>
              </select>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <Download size={14} className="mr-1 inline-block" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Adding the Download icon that was missing in the imports
function Download(props: { size: number; className: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}