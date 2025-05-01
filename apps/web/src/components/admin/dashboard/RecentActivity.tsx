"use client";

import React from "react";
import { Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
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

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full"
      variants={item}
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          <motion.div 
            className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Activity className="h-4 w-4" />
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
          {activities.map((activity, index) => (
            <motion.div 
              key={activity.id} 
              className="flex items-start"
              variants={item}
              custom={index}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-sm font-medium"
                whileHover={{ scale: 1.1 }}
              >
                {activity.user.split(' ').map(name => name[0]).join('')}
              </motion.div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {activity.user}
                  <span className="font-normal text-slate-600 dark:text-slate-400 ml-1">
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-6 text-center">
          <motion.button 
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View all activity
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;