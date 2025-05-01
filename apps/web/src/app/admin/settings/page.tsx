"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Check,
  X,
  AlertTriangle,
  Info
} from "lucide-react";

// Import all the component tabs
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";
import Appearances from "@/components/admin/settings/Appearances";
import Integrations from "@/components/admin/settings/Integrations";
import Notifications from "@/components/admin/settings/Notifications";
import AdvancedSettings from "@/components/admin/settings/AdvancedSettings";

export default function AdminSettingsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'integrations' | 'notifications' | 'advanced'>('general');
  
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showRestartAlert, setShowRestartAlert] = useState(false);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({ title: '', description: '', action: () => {} });

  // Form states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [timeZone, setTimeZone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  // Mock integrations data
  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      icon: '/assets/icons/slack.svg',
      status: 'connected',
      lastSync: 'Apr 27, 2025 14:32',
    },
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'SSO integration with Google accounts',
      icon: '/assets/icons/google.svg',
      status: 'connected',
      lastSync: 'Apr 25, 2025 09:15',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Code repository integration',
      icon: '/assets/icons/github.svg',
      status: 'disconnected',
      lastSync: null,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with thousands of apps through Zapier',
      icon: '/assets/icons/zapier.svg',
      status: 'connected',
      lastSync: 'Apr 26, 2025 10:20',
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Cloud infrastructure and storage',
      icon: '/assets/icons/aws.svg',
      status: 'connected',
      lastSync: 'Apr 27, 2025 08:05',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing',
      icon: '/assets/icons/stripe.svg',
      status: 'connected',
      lastSync: 'Apr 27, 2025 12:45',
    },
  ];
  
  // Mock webhooks data
  const webhooks = [
    {
      id: 'wh-1',
      name: 'New User Registration',
      url: 'https://api.example.com/webhooks/user-register',
      events: ['user.created'],
      status: 'active',
      created: 'Apr 10, 2025',
    },
    {
      id: 'wh-2',
      name: 'Payment Webhook',
      url: 'https://api.example.com/webhooks/payment',
      events: ['payment.succeeded', 'payment.failed'],
      status: 'active',
      created: 'Apr 15, 2025',
    },
    {
      id: 'wh-3',
      name: 'Data Backup Notification',
      url: 'https://api.example.com/webhooks/backup',
      events: ['backup.completed', 'backup.failed'],
      status: 'inactive',
      created: 'Mar 28, 2025',
    },
  ];
  
  // Mock API keys data
  const apiKeys = [
    {
      id: 'key-1',
      name: 'Production API Key',
      key: '•••••••••••••••••••••••••k8Xp',
      created: 'Apr 15, 2025',
      lastUsed: 'Apr 27, 2025',
      scopes: ['read', 'write'],
    },
    {
      id: 'key-2',
      name: 'Testing API Key',
      key: '•••••••••••••••••••••••••c7Rt',
      created: 'Apr 20, 2025',
      lastUsed: 'Apr 26, 2025',
      scopes: ['read'],
    },
    {
      id: 'key-3',
      name: 'Analytics Integration',
      key: '•••••••••••••••••••••••••j9Tn',
      created: 'Apr 22, 2025',
      lastUsed: 'Apr 25, 2025',
      scopes: ['read', 'analytics'],
    }
  ];
  
  // Animation variants
  const tabVariants = {
    inactive: { 
      opacity: 0.7,
      scale: 0.95
    },
    active: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // Mock API call to save settings
    setTimeout(() => {
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }, 800);
  };
  
  // Handle restart system
  const handleSystemRestart = () => {
    setConfirmModalData({
      title: 'Restart System',
      description: 'This will restart the entire application. All users will be temporarily disconnected. Are you sure you want to proceed?',
      action: () => {
        setShowConfirmModal(false);
        // Mock API call to restart system
        setTimeout(() => {
          setShowRestartAlert(true);
          setTimeout(() => setShowRestartAlert(false), 5000);
        }, 800);
      }
    });
    setShowConfirmModal(true);
  };
  
  // Handle clearing cache
  const handleClearCache = () => {
    setConfirmModalData({
      title: 'Clear System Cache',
      description: 'This will clear all application caches. The system might be slower for a few minutes while caches rebuild. Continue?',
      action: () => {
        setShowConfirmModal(false);
        // Mock API call to clear cache
        setTimeout(() => {
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        }, 800);
      }
    });
    setShowConfirmModal(true);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold text-slate-900 dark:text-white flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          System Settings
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center"
            onClick={handleSaveSettings}
          >
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </motion.div>
      </div>
      
      {/* Success Alert */}
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div 
            className="fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Check className="h-5 w-5 mr-2" />
            Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Restart Alert */}
      <AnimatePresence>
        {showRestartAlert && (
          <motion.div 
            className="fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Info className="h-5 w-5 mr-2" />
            System is restarting. This may take a few minutes.
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tabs */}
      <motion.div 
        className="flex border-b border-slate-200 dark:border-slate-700 mb-4 overflow-x-auto"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'general' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('general')}
          variants={tabVariants}
          animate={activeTab === 'general' ? 'active' : 'inactive'}
        >
          <Settings className="mr-2 h-4 w-4" />
          General
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'security' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('security')}
          variants={tabVariants}
          animate={activeTab === 'security' ? 'active' : 'inactive'}
        >
          <Shield className="mr-2 h-4 w-4" />
          Security
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'appearance' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('appearance')}
          variants={tabVariants}
          animate={activeTab === 'appearance' ? 'active' : 'inactive'}
        >
          <Palette className="mr-2 h-4 w-4" />
          Appearance
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'integrations' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('integrations')}
          variants={tabVariants}
          animate={activeTab === 'integrations' ? 'active' : 'inactive'}
        >
          <PlugZap className="mr-2 h-4 w-4" />
          Integrations
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'notifications' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('notifications')}
          variants={tabVariants}
          animate={activeTab === 'notifications' ? 'active' : 'inactive'}
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'advanced' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('advanced')}
          variants={tabVariants}
          animate={activeTab === 'advanced' ? 'active' : 'inactive'}
        >
          <Terminal className="mr-2 h-4 w-4" />
          Advanced
        </motion.button>
      </motion.div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'general' && (
          <GeneralSettings
            maintenanceMode={maintenanceMode}
            setMaintenanceMode={setMaintenanceMode}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            dateFormat={dateFormat}
            setDateFormat={setDateFormat}
          />
        )}
        
        {activeTab === 'security' && (
          <SecuritySettings
            apiKeys={apiKeys}
          />
        )}
        
        {activeTab === 'appearance' && (
          <Appearances
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />
        )}
        
        {activeTab === 'integrations' && (
          <Integrations
            integrations={integrations}
            webhooks={webhooks}
          />
        )}
        
        {activeTab === 'notifications' && (
          <Notifications />
        )}
        
        {activeTab === 'advanced' && (
          <AdvancedSettings
            debugMode={debugMode}
            setDebugMode={setDebugMode}
            handleClearCache={handleClearCache}
            handleSystemRestart={handleSystemRestart}
          />
        )}
      </AnimatePresence>
      
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                {confirmModalData.title}
              </h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 dark:text-slate-300">
                {confirmModalData.description}
              </p>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmModalData.action}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// Additional icons that are needed but weren't imported
function Shield(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function Palette(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  );
}

function PlugZap(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M12 22v-5"></path>
      <path d="M9 8V2"></path>
      <path d="M15 8V2"></path>
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"></path>
      <path d="m14 13-5-1"></path>
    </svg>
  );
}

function Bell(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}

function Terminal(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}