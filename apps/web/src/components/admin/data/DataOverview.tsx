"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Download, 
  Archive, 
  Upload,
  Database,
  Check
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

interface DataOverviewProps {
  dataStats: Array<{
    title: string;
    value: string;
    change: string;
    trend: string;
    icon: React.ElementType;
  }>;
  entityStats: Array<{
    name: string;
    count: number;
    growth: number;
  }>;
}

const DataOverview: React.FC<DataOverviewProps> = ({ dataStats, entityStats }) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Entity Count */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Layers className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Entity Statistics
          </h2>
          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            View details
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {entityStats.map((entity, index) => (
            <motion.div 
              key={index}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{entity.name}</h3>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {entity.count >= 1000 
                  ? `${(entity.count / 1000).toFixed(entity.count >= 100000 ? 0 : 1)}k` 
                  : entity.count}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +{entity.growth}%
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">past 30 days</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Clock className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Recent Data Activity
          </h2>
          <div className="flex items-center space-x-2">
            <button className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              All
            </button>
            <button className="text-sm px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              Exports
            </button>
            <button className="text-sm px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              Imports
            </button>
            <button className="text-sm px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              Backups
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Activity</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">Customer Data Export</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">1,256 records • 2.4 MB</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <Download size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                    Export
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">Apr 27, 2025</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">14:32:10</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <Check size={12} className="mr-1" />
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">admin@clarityhub.com</div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">Marketing Campaign Results</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">2,156 records • 3.9 MB</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <Download size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                    Export
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">Apr 27, 2025</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">15:20:11</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">michael.brown@clarityhub.com</div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">Daily Automated Backup</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full • 156.7 MB</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <Archive size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                    Backup
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">Apr 27, 2025</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">02:00:00</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <Check size={12} className="mr-1" />
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">System</div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">New Customer Import</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">456 records • 1.8 MB</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <Upload size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                    Import
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">Apr 26, 2025</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">11:25:34</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <Check size={12} className="mr-1" />
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 dark:text-slate-300">admin@clarityhub.com</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Database Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Database className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Database Insights
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Storage Usage</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">458.3 GB / 500 GB</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '91.7%' }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>91.7% used</span>
                <span>41.7 GB available</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Query Performance</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">42ms avg response</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Excellent</span>
                <span>-12ms past 30 days</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Connection Pool</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">24 / 100 active</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>24% utilized</span>
                <span>76 connections available</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Top Growing Entities</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-700 dark:text-slate-300">Orders</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-slate-700 dark:text-slate-300">+8.5%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-700 dark:text-slate-300">Users</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-slate-700 dark:text-slate-300">+12.3%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-700 dark:text-slate-300">Transactions</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-slate-700 dark:text-slate-300">+9.7%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-700 dark:text-slate-300">Organizations</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-slate-700 dark:text-slate-300">+5.8%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-700 dark:text-slate-300">Products</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-slate-700 dark:text-slate-300">+3.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataOverview;