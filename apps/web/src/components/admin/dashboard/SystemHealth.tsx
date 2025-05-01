"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SystemHealthProps {}

const SystemHealth: React.FC<SystemHealthProps> = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const cardHover = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
      variants={item}
      initial="hidden"
      animate="visible"
      whileHover={cardHover.hover}
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">System Health</h2>
          <motion.div 
            className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <BarChart3 className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Server Uptime</p>
              <motion.span 
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                Healthy
              </motion.span>
            </div>
            <motion.p 
              className="text-xl font-bold text-slate-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              99.98%
            </motion.p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 30 days</p>
          </motion.div>
          <motion.div 
            className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">API Performance</p>
              <motion.span 
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                Optimal
              </motion.span>
            </div>
            <motion.p 
              className="text-xl font-bold text-slate-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              124ms
            </motion.p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average response time</p>
          </motion.div>
          <motion.div 
            className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Database Load</p>
              <motion.span 
                className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                Moderate
              </motion.span>
            </div>
            <motion.p 
              className="text-xl font-bold text-slate-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              68%
            </motion.p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current utilization</p>
          </motion.div>
        </motion.div>
        <div className="mt-4 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/admin/health" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              View detailed health metrics
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemHealth;