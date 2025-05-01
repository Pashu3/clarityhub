"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  BarChart, 
  Download, 
  Upload, 
  RefreshCw, 
  Filter, 
  Search, 
  ChevronDown,
  Archive,
  Settings
} from "lucide-react";
import DataOverview from "@/components/admin/data/DataOverview";
import ExportHistory from "@/components/admin/data/ExportHistory";
import ImportHistory from "@/components/admin/data/ImportHistory";
import BackupAndRestore from "@/components/admin/data/BackupAndRestore";
import DataSettings from "@/components/admin/data/DataSettings";

export default function AdminDataPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'export' | 'import' | 'backup' | 'settings'>('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [dataTypeFilter, setDataTypeFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data exports history
  const exportHistory = [
    { 
      id: "1", 
      name: "Customer Data Export",
      type: "Customers",
      format: "CSV",
      size: "2.4 MB",
      records: "1,256",
      status: "Completed",
      date: "Apr 27, 2025",
      time: "14:32:10",
      requestedBy: "admin@clarityhub.com"
    },
    { 
      id: "2", 
      name: "Monthly Sales Report",
      type: "Transactions",
      format: "XLSX",
      size: "5.7 MB",
      records: "3,847",
      status: "Completed",
      date: "Apr 25, 2025",
      time: "09:15:22",
      requestedBy: "james.wilson@clarityhub.com"
    },
    { 
      id: "3", 
      name: "User Activity Logs",
      type: "Activity",
      format: "JSON",
      size: "8.1 MB",
      records: "15,932",
      status: "Completed",
      date: "Apr 22, 2025",
      time: "16:45:03",
      requestedBy: "sarah.parker@example.com"
    },
    { 
      id: "4", 
      name: "Product Catalog",
      type: "Products",
      format: "CSV",
      size: "1.3 MB",
      records: "542",
      status: "Completed",
      date: "Apr 20, 2025",
      time: "11:30:45",
      requestedBy: "admin@clarityhub.com"
    },
    { 
      id: "5", 
      name: "Marketing Campaign Results",
      type: "Analytics",
      format: "XLSX",
      size: "3.9 MB",
      records: "2,156",
      status: "Processing",
      date: "Apr 27, 2025",
      time: "15:20:11",
      requestedBy: "michael.brown@clarityhub.com"
    },
    { 
      id: "6", 
      name: "Customer Support Tickets",
      type: "Support",
      format: "JSON",
      size: "4.2 MB",
      records: "873",
      status: "Completed",
      date: "Apr 18, 2025",
      time: "13:10:32",
      requestedBy: "emma.davis@example.com"
    },
    { 
      id: "7", 
      name: "Inventory Stock Levels",
      type: "Inventory",
      format: "CSV",
      size: "1.8 MB",
      records: "1,042",
      status: "Failed",
      date: "Apr 15, 2025",
      time: "10:05:18",
      requestedBy: "james.wilson@clarityhub.com"
    },
  ];

  // Mock import history
  const importHistory = [
    { 
      id: "1", 
      name: "New Customer Import",
      type: "Customers",
      format: "CSV",
      size: "1.8 MB",
      records: "456",
      status: "Completed",
      date: "Apr 26, 2025",
      time: "11:25:34",
      requestedBy: "admin@clarityhub.com",
      success: 456,
      failed: 0
    },
    { 
      id: "2", 
      name: "Product Update",
      type: "Products",
      format: "XLSX",
      size: "2.3 MB",
      records: "128",
      status: "Completed",
      date: "Apr 24, 2025",
      time: "15:42:18",
      requestedBy: "emma.davis@example.com",
      success: 125,
      failed: 3
    },
    { 
      id: "3", 
      name: "Partner Organization Import",
      type: "Organizations",
      format: "CSV",
      size: "954 KB",
      records: "32",
      status: "Failed",
      date: "Apr 23, 2025",
      time: "09:12:45",
      requestedBy: "james.wilson@clarityhub.com",
      success: 0,
      failed: 32
    },
    { 
      id: "4", 
      name: "Inventory Restock",
      type: "Inventory",
      format: "CSV",
      size: "1.2 MB",
      records: "285",
      status: "Completed",
      date: "Apr 21, 2025",
      time: "14:30:22",
      requestedBy: "michael.brown@clarityhub.com",
      success: 285,
      failed: 0
    },
    { 
      id: "5", 
      name: "User Account Batch",
      type: "Users",
      format: "JSON",
      size: "782 KB",
      records: "45",
      status: "Completed With Errors",
      date: "Apr 19, 2025",
      time: "16:15:08",
      requestedBy: "admin@clarityhub.com",
      success: 42,
      failed: 3
    },
  ];

  // Mock backup history
  const backupHistory = [
    { 
      id: "1", 
      name: "Daily Automated Backup",
      type: "Full",
      size: "156.7 MB",
      status: "Completed",
      date: "Apr 27, 2025",
      time: "02:00:00",
      duration: "12 minutes",
      retention: "30 days"
    },
    { 
      id: "2", 
      name: "Daily Automated Backup",
      type: "Full",
      size: "155.3 MB",
      status: "Completed",
      date: "Apr 26, 2025",
      time: "02:00:00",
      duration: "11 minutes",
      retention: "30 days"
    },
    { 
      id: "3", 
      name: "Weekly Backup",
      type: "Full",
      size: "158.2 MB",
      status: "Completed",
      date: "Apr 21, 2025",
      time: "01:00:00",
      duration: "15 minutes",
      retention: "90 days"
    },
    { 
      id: "4", 
      name: "Pre-Update Backup",
      type: "Full",
      size: "154.8 MB",
      status: "Completed",
      date: "Apr 19, 2025",
      time: "22:45:12",
      duration: "13 minutes",
      retention: "365 days"
    },
    { 
      id: "5", 
      name: "Manual Backup",
      type: "Partial",
      size: "42.3 MB",
      status: "Completed",
      date: "Apr 18, 2025",
      time: "16:32:45",
      duration: "5 minutes",
      retention: "30 days"
    },
    { 
      id: "6", 
      name: "Monthly Backup",
      type: "Full",
      size: "152.1 MB",
      status: "Completed",
      date: "Apr 01, 2025",
      time: "01:00:00",
      duration: "14 minutes",
      retention: "365 days"
    },
  ];

  // Data summary stats
  const dataStats = [
    { 
      title: "Total Data Size", 
      value: "458.3 GB",
      change: "+5.7 GB",
      trend: "up",
      icon: Database
    },
    { 
      title: "Records Count", 
      value: "2.45M",
      change: "+152K",
      trend: "up",
      icon: Archive
    },
    { 
      title: "Database Health", 
      value: "98%",
      change: "+2%",
      trend: "up",
      icon: RefreshCw
    },
    { 
      title: "Avg. Query Time", 
      value: "42ms",
      change: "-12ms",
      trend: "down",
      icon: RefreshCw
    },
  ];

  // Entity stats
  const entityStats = [
    { name: "Users", count: 24586, growth: 12.3 },
    { name: "Orders", count: 158423, growth: 8.5 },
    { name: "Products", count: 3254, growth: 3.2 },
    { name: "Transactions", count: 352876, growth: 9.7 },
    { name: "Organizations", count: 1842, growth: 5.8 },
  ];

  // Filter data based on search and filters
  const filteredExports = exportHistory.filter(exp => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Data type filter
    const matchesType = dataTypeFilter === null || exp.type === dataTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Filter import history based on search
  const filteredImports = importHistory.filter(imp => {
    return searchQuery.trim() === "" || 
      imp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter backup history based on search
  const filteredBackups = backupHistory.filter(backup => {
    return searchQuery.trim() === "" ||
      backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      backup.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Items per page
  const itemsPerPage = 5;

  // Pagination for different tabs
  const getPaginatedItems = () => {
    let filteredItems: any[] = [];
    
    switch(activeTab) {
      case 'export':
        filteredItems = filteredExports;
        break;
      case 'import':
        filteredItems = filteredImports;
        break;
      case 'backup':
        filteredItems = filteredBackups;
        break;
      default:
        filteredItems = filteredExports;
    }
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    return {
      items: filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
      totalPages
    };
  };

  const { items: paginatedItems, totalPages } = getPaginatedItems();

  // Get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Completed With Errors':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };

  // Animation variants
  const tabVariants = {
    inactive: { 
      opacity: 0.7,
      scale: 0.95
    },
    active: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }
  };

  // Reset current page when tab or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, dataTypeFilter]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold text-slate-900 dark:text-white flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Database className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          Data Management
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            New Export
          </button>
          
          <button className="p-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <RefreshCw size={18} />
          </button>
        </motion.div>
      </div>
      
      {/* Tabs */}
      <motion.div 
        className="flex border-b border-slate-200 dark:border-slate-700 mb-4 overflow-x-auto"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'overview' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('overview')}
          variants={tabVariants}
          animate={activeTab === 'overview' ? 'active' : 'inactive'}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Overview
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'export' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('export')}
          variants={tabVariants}
          animate={activeTab === 'export' ? 'active' : 'inactive'}
        >
          <Download className="mr-2 h-4 w-4" />
          Export History
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'import' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('import')}
          variants={tabVariants}
          animate={activeTab === 'import' ? 'active' : 'inactive'}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import History
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'backup' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('backup')}
          variants={tabVariants}
          animate={activeTab === 'backup' ? 'active' : 'inactive'}
        >
          <Archive className="mr-2 h-4 w-4" />
          Backup & Restore
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'settings' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('settings')}
          variants={tabVariants}
          animate={activeTab === 'settings' ? 'active' : 'inactive'}
        >
          <Settings className="mr-2 h-4 w-4" />
          Data Settings
        </motion.button>
      </motion.div>
      
      {activeTab !== 'overview' && activeTab !== 'settings' && (
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {activeTab === 'export' && (
                <div className="relative">
                  <button
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Data Type</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              )}
              
              {activeTab === 'backup' && (
                <div className="relative">
                  <button
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Backup Type</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              )}
              
              {dataTypeFilter && (
                <button
                  onClick={() => setDataTypeFilter(null)}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'export' ? 'exports' : activeTab === 'import' ? 'imports' : 'backups'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <DataOverview 
            dataStats={dataStats}
            entityStats={entityStats}
          />
        )}
        
        {activeTab === 'export' && (
          <ExportHistory 
            exportHistory={filteredExports}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            itemsPerPage={itemsPerPage}
            paginatedItems={paginatedItems}
            totalPages={totalPages}
            showExportModal={showExportModal}
            setShowExportModal={setShowExportModal}
          />
        )}
        
        {activeTab === 'import' && (
          <ImportHistory 
            importHistory={filteredImports}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            itemsPerPage={itemsPerPage}
            paginatedItems={paginatedItems}
            totalPages={totalPages}
          />
        )}
        
        {activeTab === 'backup' && (
          <BackupAndRestore 
            backupHistory={filteredBackups}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            itemsPerPage={itemsPerPage}
            paginatedItems={paginatedItems}
            totalPages={totalPages}
          />
        )}
        
        {activeTab === 'settings' && (
          <DataSettings />
        )}
      </AnimatePresence>
    </motion.div>
  );
}