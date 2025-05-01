"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  HelpCircle,
  MessageSquare
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  category: string;
  author: string;
  lastUpdated: string;
  views: number;
  readTime: string;
  image: string | null;
}

interface FaqsProps {
  paginatedContent: ContentItem[];
  searchQuery: string;
  typeFilter: string | null;
  statusFilter: string | null;
  selectedContent: string[];
  toggleContentSelection: (contentId: string) => void;
  getStatusBadgeStyles: (status: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  viewMode: 'grid' | 'list';
  containerVariants: any;
  itemVariants: any;
}

export default function Faqs({
  paginatedContent,
  searchQuery,
  typeFilter,
  statusFilter,
  selectedContent,
  toggleContentSelection,
  getStatusBadgeStyles,
  getTypeIcon,
  viewMode,
  containerVariants,
  itemVariants
}: FaqsProps) {
  
  const noContentMessage = (
    <div>
      <MessageSquare size={48} className="text-slate-400 mx-auto mb-4" />
      <p className="font-medium text-lg mb-1 text-slate-700 dark:text-slate-300">No FAQs found</p>
      <p className="text-slate-500 dark:text-slate-400">Create frequently asked questions to help your users</p>
    </div>
  );
  
  return (
    <>
      {viewMode === 'list' ? (
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >          
          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-3">
                    <div className="flex items-center">
                      <span className="ml-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Question</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Author</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Updated</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <AnimatePresence>
                  {paginatedContent.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      component={null}
                    >
                      {paginatedContent.map(item => (
                        <motion.tr 
                          key={item.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          variants={itemVariants}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={selectedContent.includes(item.id)}
                                onChange={() => toggleContentSelection(item.id)}
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {item.readTime} read
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {item.category}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {item.author}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {item.lastUpdated}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {item.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Eye size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                                <Edit size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.div>
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                        {searchQuery || typeFilter || statusFilter ? (
                          <div>
                            <p className="font-medium mb-1">No FAQs match your filters</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        ) : (
                          noContentMessage
                        )}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paginatedContent.length > 0 ? (
            paginatedContent.map(item => (
              <motion.div 
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative p-5">
                  <div className="absolute top-5 right-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="absolute top-5 left-5">
                    <input 
                      type="checkbox" 
                      checked={selectedContent.includes(item.id)}
                      onChange={() => toggleContentSelection(item.id)}
                      className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mt-8 mb-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto">
                      <MessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="font-medium text-lg text-slate-900 dark:text-white mb-2 text-center mt-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                    {item.category}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700 mt-2">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {item.views.toLocaleString()} views
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {searchQuery || typeFilter || statusFilter ? (
                <div>
                  <HelpCircle size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="font-medium text-lg mb-1 text-slate-700 dark:text-slate-300">No FAQs match your filters</p>
                  <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                noContentMessage
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}