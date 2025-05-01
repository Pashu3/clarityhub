"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileQuestion, 
  Search 
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

interface KnowledgeBaseProps {
  knowledgeArticles: any[];
}

export default function KnowledgeBase({ knowledgeArticles }: KnowledgeBaseProps) {
  return (
    <motion.div
      key="knowledge"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Knowledge Base
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <motion.div 
            className="p-5 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Getting Started</h3>
            <ul className="space-y-2">
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Platform Overview</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Setting Up Your Account</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Adding Team Members</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">First Steps Guide</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="p-5 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Dashboard & Reports</h3>
            <ul className="space-y-2">
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Creating Custom Dashboards</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Setting Up Reports</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Data Visualization Options</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Sharing Reports</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="p-5 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Integrations</h3>
            <ul className="space-y-2">
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Salesforce Integration</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Google Analytics Connection</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Slack Notifications</li>
              <li className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">API Documentation</li>
            </ul>
          </motion.div>
        </div>
        
        <h3 className="text-md font-medium text-slate-900 dark:text-white mb-4">Popular Articles</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Views</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  component={null}
                >
                  {knowledgeArticles.map((article, index) => (
                    <motion.tr 
                      key={article.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      variants={itemVariants}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{article.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{article.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {article.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {article.lastUpdated}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.div>
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}