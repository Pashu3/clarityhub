"use client";

import React from "react";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: number;
  name: string;
  priority: "high" | "medium" | "low";
  due: string;
}

interface PendingTasksProps {
  tasks: Task[];
}

const PendingTasks: React.FC<PendingTasksProps> = ({ tasks }) => {
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
          <h2 className="font-semibold text-slate-900 dark:text-white">Pending Tasks</h2>
          <motion.div 
            className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FileText className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      <div className="p-6">
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {tasks.map((task, index) => (
            <motion.div 
              key={task.id} 
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              variants={item}
              custom={index}
              whileHover={{ y: -2, x: 2 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.name}</p>
                <motion.span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {task.priority}
                </motion.span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Due: {task.due}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PendingTasks;