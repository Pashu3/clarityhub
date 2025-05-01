"use client";

import React, { useRef, useEffect } from "react";
import { Search, X, Clock, Users, CreditCard, Settings, FileText, Home,BarChart2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, isDark }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock search results data
  const mockSearchResults = [
    { id: 1, type: "user", title: "John Smith", subtitle: "john@example.com", link: "/admin/users/1" },
    { id: 2, type: "user", title: "Emma Johnson", subtitle: "emma@example.com", link: "/admin/users/2" },
    { id: 3, type: "page", title: "User Management", subtitle: "Admin section", link: "/admin/users" },
    { id: 4, type: "page", title: "Billing Settings", subtitle: "Admin section", link: "/admin/billing" },
    { id: 5, type: "doc", title: "API Documentation", subtitle: "Developer resources", link: "/admin/docs/api" }
  ];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      // Filter mock results based on query
      const filteredResults = mockSearchResults.filter(
        result => result.title.toLowerCase().includes(query.toLowerCase()) ||
                 result.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  // Focus search input when search is opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close search
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-start justify-center pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={handleSearch}
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <div className="flex items-center">
                <kbd className="hidden sm:inline-block px-2 py-1 mr-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded">ESC</kbd>
                <motion.button 
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </motion.button>
              </div>
            </div>
            
            {/* Search results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() !== "" && (
                <div className="p-4">
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { 
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.05
                            }
                          }
                        }}
                        initial="hidden"
                        animate="visible"
                      >
                        {searchResults.map(result => (
                          <motion.div
                            key={result.id}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 }
                            }}
                          >
                            <Link 
                              href={result.link} 
                              className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                              onClick={onClose}
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3">
                                {result.type === 'user' && <Users className="h-4 w-4" />}
                                {result.type === 'page' && <Home className="h-4 w-4" />}
                                {result.type === 'doc' && <FileText className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{result.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{result.subtitle}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-slate-500 dark:text-slate-400">No results found for "{searchQuery}"</p>
                    </motion.div>
                  )}
                </div>
              )}
              
              {searchQuery.trim() === "" && (
                <div className="p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Recent searches</p>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-3" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">user management</p>
                    </div>
                    <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-3" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">billing settings</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 mb-3">Quick links</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href="/admin/users"
                      className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={onClose}
                    >
                      <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">Users</p>
                    </Link>
                    <Link 
                      href="/admin/billing"
                      className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={onClose}
                    >
                      <CreditCard className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">Billing</p>
                    </Link>
                    <Link 
                      href="/admin/settings"
                      className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={onClose}
                    >
                      <Settings className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">Settings</p>
                    </Link>
                    <Link 
                      href="/admin/reports"
                      className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={onClose}
                    >
                      <BarChart2 className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">Reports</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;