"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  LogOut, 
  Smartphone, 
  Database, 
  Monitor 
} from "lucide-react";

// Animation variants
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

interface ActiveSessionsProps {
  activeSessions: any[];
}

const ActiveSessions: React.FC<ActiveSessionsProps> = ({
  activeSessions
}) => {
  return (
    <motion.div
      key="sessions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-medium text-slate-900 dark:text-white">Active Sessions ({activeSessions.length})</h3>
          <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <LogOut size={14} className="inline-block mr-1.5" />
            Terminate All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Device</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Started</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Activity</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {activeSessions.map((session, index) => (
                <motion.tr 
                  key={session.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{session.user}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{session.ip}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                      {session.type === 'Mobile' ? (
                        <Smartphone size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                      ) : session.type === 'API' ? (
                        <Database size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                      ) : (
                        <Monitor size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
                      )}
                      {session.device}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {session.started}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {session.lastActivity}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.type === 'API' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : session.type === 'Mobile'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    }`}>
                      {session.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm px-3 py-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Terminate
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveSessions;