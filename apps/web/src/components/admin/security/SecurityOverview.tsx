"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin, 
  Eye,
  ShieldAlert,
  CheckCircle2 as Check,
  X
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05 
    } 
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

interface SecurityOverviewProps {
  securityRecommendations: any[];
  securityAlerts: any[];
  getStatusBadgeStyles: (status: string) => string;
  getSeverityBadgeStyles: (severity: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  setActiveTab: (tab: 'overview' | 'loginAttempts' | 'sessions' | 'audit' | 'settings') => void;
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({
  securityRecommendations,
  securityAlerts,
  getStatusBadgeStyles,
  getSeverityBadgeStyles,
  getStatusIcon,
  setActiveTab
}) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Security recommendations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
            Security Recommendations
          </h2>
        </div>
        
        <div className="space-y-4">
          {securityRecommendations.map((rec, index) => (
            <motion.div 
              key={rec.id}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className={`p-2 rounded-md mr-3 mt-0.5 ${
                    rec.priority === 'High' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{rec.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{rec.description}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(rec.status)}`}>
                  {getStatusIcon(rec.status)}
                  {rec.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Recent security alerts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500 dark:text-red-400" />
            Recent Security Alerts
          </h2>
          <button 
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            onClick={() => setActiveTab('loginAttempts')}
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {securityAlerts.slice(0, 3).map((alert, index) => (
            <motion.div 
              key={alert.id}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">{alert.title}</h3>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeStyles(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(alert.status)}`}>
                      {getStatusIcon(alert.status)}
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{alert.description}</p>
                  <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.time}
                    <span className="mx-2">•</span>
                    <User className="h-3 w-3 mr-1" />
                    {alert.user}
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    {alert.location}
                  </div>
                </div>
                
                <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                  <Eye size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityOverview;