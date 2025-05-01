"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SecurityAlert {
  id: number;
  level: "high" | "medium" | "low";
  message: string;
  time: string;
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ alerts }) => {
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
      whileHover={cardHover.hover}
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Security Alerts</h2>
          <motion.div 
            className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.1, 1],
              transition: { repeat: 3, repeatType: "reverse", duration: 1, delay: 1 }
            }}
          >
            <ShieldAlert className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      <div className="p-6">
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {alerts.map((alert, index) => (
            <motion.div 
              key={alert.id} 
              className="flex items-start"
              variants={item}
              custom={index}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`h-2.5 w-2.5 rounded-full mt-1.5 ${
                  alert.level === 'high' ? 'bg-red-500' :
                  alert.level === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                animate={alert.level === 'high' ? { 
                  scale: [1, 1.5, 1],
                  transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
                } : {}}
              ></motion.div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{alert.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-4 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/admin/security" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              View all alerts
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityAlerts;