"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  href: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  name, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  href,
  index 
}) => {
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
      variants={item}
      whileHover="hover"
      custom={index}
      variants={cardHover}
    >
      <Link 
        href={href} 
        className="block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{name}</p>
            <motion.p 
              className="text-2xl font-bold mt-1 text-slate-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div 
            className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </div>
        <div className="mt-4 flex items-center">
          <motion.span 
            className={`text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            animate={{ 
              y: [0, -4, 0],
              transition: { 
                repeat: 2, 
                duration: 0.5, 
                delay: 0.5 + index * 0.1,
                repeatType: "reverse"
              }
            }}
          >
            {change}
          </motion.span>
          <motion.div
            animate={{ 
              y: trend === 'up' ? [0, -3, 0] : [0, 3, 0],
              transition: { 
                repeat: 2, 
                duration: 0.5, 
                delay: 0.5 + index * 0.1,
                repeatType: "reverse"
              }
            }}
          >
            {trend === 'up' ? 
              <ArrowUp className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" /> : 
              <ArrowDown className="h-3 w-3 ml-1 text-red-600 dark:text-red-400" />
            }
          </motion.div>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">from last month</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default StatCard;