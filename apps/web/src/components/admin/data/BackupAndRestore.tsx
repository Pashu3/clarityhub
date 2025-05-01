"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Archive, 
  Check, 
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Database,
  HardDrive,
  Cloud,
  Server,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Shield
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  }
};

interface BackupItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  date: string;
  time: string;
  duration: string;
  retention: string;
}

interface BackupAndRestoreProps {
  backupHistory: BackupItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  itemsPerPage: number;
  paginatedItems: BackupItem[];
  totalPages: number;
}

const BackupAndRestore: React.FC<BackupAndRestoreProps> = ({
  backupHistory,
  currentPage,
  setCurrentPage,
  searchQuery,
  itemsPerPage,
  paginatedItems,
  totalPages
}) => {
  // Modal states
  const [showCreateBackupModal, setShowCreateBackupModal] = useState(false);
  const [showRestoreBackupModal, setShowRestoreBackupModal] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [operationSuccess, setOperationSuccess] = useState(false);
  
  // Create backup form state
  const [backupName, setBackupName] = useState("");
  const [backupType, setBackupType] = useState("Full");
  const [backupRetention, setBackupRetention] = useState("30 days");
  
  // Helper function to get status badge styling
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

  // Handle create backup
  const handleCreateBackup = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOperationSuccess(true);
    
    // Close modal after success
    setTimeout(() => {
      setShowCreateBackupModal(false);
      setOperationSuccess(false);
      setBackupName("");
    }, 1500);
  };

  // Handle restore backup
  const handleRestoreBackup = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOperationSuccess(true);
    
    // Close modal after success
    setTimeout(() => {
      setShowRestoreBackupModal(false);
      setOperationSuccess(false);
    }, 1500);
  };

  // Find selected backup
  const selectedBackup = selectedBackupId 
    ? backupHistory.find(backup => backup.id === selectedBackupId) 
    : null;

  return (
    <motion.div
      key="backup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-end gap-3 mb-4">
        <motion.button
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center"
          onClick={() => setShowRestoreBackupModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Archive className="mr-2 h-4 w-4" />
          Restore from Backup
        </motion.button>
        <motion.button
          className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center"
          onClick={() => setShowCreateBackupModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Archive className="mr-2 h-4 w-4" />
          Create Manual Backup
        </motion.button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Size</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Retention</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <AnimatePresence>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((backup: BackupItem) => (
                    <motion.tr 
                      key={backup.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      variants={itemVariants}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{backup.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          backup.type === 'Full' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 dark:text-slate-300">{backup.date}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{backup.time}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {backup.duration}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {backup.retention}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(backup.status)}`}>
                          {backup.status === 'Completed' && <Check size={12} className="mr-1" />}
                          {backup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          onClick={() => {
                            setSelectedBackupId(backup.id);
                            setShowRestoreBackupModal(true);
                          }}
                        >
                          Restore
                        </button>
                        <button className="text-sm px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          Download
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <p className="font-medium mb-1">No backups found</p>
                        <p className="text-sm">No data matching your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {backupHistory.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, backupHistory.length)} of {backupHistory.length} backups
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                <ChevronLeft size={16} />
              </motion.button>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </div>
              <motion.button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Create Backup Modal */}
      <AnimatePresence>
        {showCreateBackupModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowCreateBackupModal(false)}
            />
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                    <Archive className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Create Manual Backup
                  </h3>
                  <button 
                    onClick={() => !isProcessing && setShowCreateBackupModal(false)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    disabled={isProcessing}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {operationSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Backup Created Successfully</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-center">
                        Your backup has been initiated and will be available shortly
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Backup Name
                        </label>
                        <input 
                          type="text" 
                          value={backupName}
                          onChange={(e) => setBackupName(e.target.value)}
                          placeholder="e.g., Manual Backup - Apr 27, 2025"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                          disabled={isProcessing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Backup Type
                        </label>
                        <select 
                          value={backupType}
                          onChange={(e) => setBackupType(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                          disabled={isProcessing}
                        >
                          <option value="Full">Full Backup</option>
                          <option value="Partial">Partial Backup</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Retention Period
                        </label>
                        <select 
                          value={backupRetention}
                          onChange={(e) => setBackupRetention(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                          disabled={isProcessing}
                        >
                          <option value="7 days">7 days</option>
                          <option value="30 days">30 days</option>
                          <option value="90 days">90 days</option>
                          <option value="365 days">365 days</option>
                          <option value="Forever">Forever</option>
                        </select>
                      </div>
                      
                      {backupType === "Partial" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Select Data to Include
                          </label>
                          <div className="space-y-2 mt-2">
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                                defaultChecked
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Users & Accounts</span>
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                                defaultChecked
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Customer Data</span>
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                                defaultChecked
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Transaction History</span>
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Activity Logs</span>
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Settings & Configurations</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!operationSuccess && (
                  <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
                    <button
                      onClick={() => !isProcessing && setShowCreateBackupModal(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateBackup}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Backup...
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          Create Backup
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Restore Backup Modal */}
      <AnimatePresence>
        {showRestoreBackupModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowRestoreBackupModal(false)}
            />
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                    <Archive className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
                    Restore from Backup
                  </h3>
                  <button 
                    onClick={() => !isProcessing && setShowRestoreBackupModal(false)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    disabled={isProcessing}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {operationSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Restore Initiated Successfully</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-center">
                        Your data is being restored. This may take a few minutes.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!selectedBackupId ? (
                        <>
                          <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
                              <Archive className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Select a Backup</h3>
                            <p className="text-slate-500 dark:text-slate-400">
                              Please select a backup from the list to restore
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Select Backup
                            </label>
                            <select 
                              value={selectedBackupId || ""}
                              onChange={(e) => setSelectedBackupId(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                            >
                              <option value="">Select a backup</option>
                              {backupHistory.map(backup => (
                                <option key={backup.id} value={backup.id}>
                                  {backup.name} - {backup.date} ({backup.size})
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4 mb-4">
                            <div className="flex">
                              <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-3 flex-shrink-0" />
                              <div>
                                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Warning</h3>
                                <div className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                                  <p>Restoring from a backup will replace all current data. This action cannot be undone.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">Backup Details</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Name:</span>
                                <span className="text-slate-900 dark:text-white font-medium">{selectedBackup?.name}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                                <span className="text-slate-900 dark:text-white">{selectedBackup?.date} {selectedBackup?.time}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Type:</span>
                                <span className="text-slate-900 dark:text-white">{selectedBackup?.type}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Size:</span>
                                <span className="text-slate-900 dark:text-white">{selectedBackup?.size}</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                                disabled={isProcessing}
                              />
                              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                Create a backup of current data before restoring
                              </span>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {!operationSuccess && (
                  <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowRestoreBackupModal(false);
                        setSelectedBackupId(null);
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRestoreBackup}
                      className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center"
                      disabled={isProcessing || !selectedBackupId}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restore Data
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BackupAndRestore;