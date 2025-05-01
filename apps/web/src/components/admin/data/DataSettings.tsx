"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Archive, 
  Download, 
  Clock, 
  Database, 
  Shield, 
  CheckCircle2,
  Save,
  Loader2
} from "lucide-react";

interface DataSettingsProps {}

const DataSettings: React.FC<DataSettingsProps> = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset success message after a delay
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Backup Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Archive className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Backup Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Automated backups</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule regular backups of your data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Backup frequency</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How often to run automated backups</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>Hourly</option>
              <option defaultValue="selected">Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Backup time</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">When to run daily backups</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>12:00 AM</option>
              <option>1:00 AM</option>
              <option defaultValue="selected">2:00 AM</option>
              <option>3:00 AM</option>
              <option>4:00 AM</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Retention policy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep daily backups</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>7 days</option>
              <option defaultValue="selected">30 days</option>
              <option>90 days</option>
              <option>365 days</option>
              <option>Forever</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Backup storage location</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Where to store backups</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option defaultValue="selected">Local Storage</option>
              <option>Amazon S3</option>
              <option>Google Cloud Storage</option>
              <option>Azure Blob Storage</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Export & Import Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Download className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Export & Import Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Maximum export size</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Limit the size of data exports</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>50 MB</option>
              <option>100 MB</option>
              <option defaultValue="selected">500 MB</option>
              <option>1 GB</option>
              <option>No limit</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Export retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep generated exports</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>24 hours</option>
              <option>48 hours</option>
              <option defaultValue="selected">7 days</option>
              <option>30 days</option>
              <option>Forever</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Import validation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Validate data before importing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Import rollback</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically rollback failed imports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Data Retention */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Clock className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Data Retention
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Activity logs retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep user activity logs</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>30 days</option>
              <option>90 days</option>
              <option defaultValue="selected">1 year</option>
              <option>3 years</option>
              <option>Forever</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Deleted data retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep deleted records</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>7 days</option>
              <option defaultValue="selected">30 days</option>
              <option>90 days</option>
              <option>180 days</option>
              <option>Forever</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Data purging</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically purge old data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Analytics data retention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How long to keep analytics data</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>6 months</option>
              <option defaultValue="selected">1 year</option>
              <option>2 years</option>
              <option>5 years</option>
              <option>Forever</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Database Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Database className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Database Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Connection pool size</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum number of database connections</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>25</option>
              <option>50</option>
              <option defaultValue="selected">100</option>
              <option>200</option>
              <option>300</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Query timeout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum query execution time</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option>10 seconds</option>
              <option defaultValue="selected">30 seconds</option>
              <option>60 seconds</option>
              <option>120 seconds</option>
              <option>No limit</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Query logging</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log slow database queries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Maintenance window</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">When to perform database maintenance</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2">
              <option defaultValue="selected">Sunday, 1:00 AM - 3:00 AM</option>
              <option>Monday, 1:00 AM - 3:00 AM</option>
              <option>Saturday, 1:00 AM - 3:00 AM</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Shield className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Data Security
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Data encryption</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Encrypt sensitive data at rest</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Data anonymization</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Anonymize personal data in exports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Data access auditing</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log all data access events</p>
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
        {saveSuccess && (
          <motion.div 
            className="mr-4 flex items-center text-green-600 dark:text-green-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Settings saved successfully
          </motion.div>
        )}
        <motion.button 
          className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Data Settings
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DataSettings;