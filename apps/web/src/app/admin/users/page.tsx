"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  Download, 
  UserPlus,
  Mail,
  Shield,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import AddUserModal, { UserData } from "@/components/admin/modals/AddUserModal";


export default function AdminUsersPage() {
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  
  // Mock user data
  const users = [
    { 
      id: "1", 
      name: "Emily Johnson", 
      email: "emily.johnson@example.com", 
      role: "Admin", 
      status: "Active",
      lastActive: "2 hours ago",
      dateJoined: "Feb 12, 2024",
      avatar: null
    },
    { 
      id: "2", 
      name: "Michael Smith", 
      email: "michael.smith@example.com", 
      role: "User", 
      status: "Active",
      lastActive: "5 minutes ago",
      dateJoined: "Mar 28, 2024",
      avatar: null
    },
    { 
      id: "3", 
      name: "Sarah Wilson", 
      email: "sarah.wilson@example.com", 
      role: "Editor", 
      status: "Active",
      lastActive: "1 day ago",
      dateJoined: "Jan 5, 2024",
      avatar: null
    },
    { 
      id: "4", 
      name: "David Brown", 
      email: "david.brown@example.com", 
      role: "User", 
      status: "Inactive",
      lastActive: "2 weeks ago",
      dateJoined: "Oct 18, 2023",
      avatar: null
    },
    { 
      id: "5", 
      name: "Jessica Lee", 
      email: "jessica.lee@example.com", 
      role: "User", 
      status: "Suspended",
      lastActive: "1 month ago",
      dateJoined: "Jul 30, 2023",
      avatar: null
    },
    { 
      id: "6", 
      name: "Thomas Martinez", 
      email: "thomas.martinez@example.com", 
      role: "Editor", 
      status: "Active",
      lastActive: "3 days ago",
      dateJoined: "Dec 12, 2023",
      avatar: null
    },
    { 
      id: "7", 
      name: "Olivia Garcia", 
      email: "olivia.garcia@example.com", 
      role: "Admin", 
      status: "Active",
      lastActive: "Just now",
      dateJoined: "Apr 3, 2024",
      avatar: null
    },
  ];
  const handleAddUser = async (userData: UserData) => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: "Active",
      lastActive: "Just now",
      dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: null
    };
    
    setUsers(prevUsers => [newUser, ...prevUsers]);
    
    // Return success
    return Promise.resolve();
  };
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === null || user.status === statusFilter;
    
    // Role filter
    const matchesRole = roleFilter === null || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Pagination
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  
  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  // Toggle all users selection
  const toggleAllSelection = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  // Get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Inactive':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
      case 'Suspended':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };
  
  // Get role badge styling
  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Editor':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'User':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      backgroundColor: "var(--hover-bg)",
      scale: 1.005,
      transition: { duration: 0.2 }
    }
  };

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
          User Management
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Filter and search toolbar */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <motion.button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter size={16} className="mr-2" />
                <span>Status</span>
                <motion.div
                  animate={{ rotate: statusDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="ml-2" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {statusDropdownOpen && (
                  <motion.div 
                    className="absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setStatusFilter('Active');
                          setStatusDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        Active
                      </motion.button>
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setStatusFilter('Inactive');
                          setStatusDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        Inactive
                      </motion.button>
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setStatusFilter('Suspended');
                          setStatusDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        Suspended
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <motion.button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield size={16} className="mr-2" />
                <span>Role</span>
                <motion.div
                  animate={{ rotate: roleDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="ml-2" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div 
                    className="absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setRoleFilter('Admin');
                          setRoleDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        Admin
                      </motion.button>
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setRoleFilter('Editor');
                          setRoleDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        Editor
                      </motion.button>
                      <motion.button 
                        className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                        onClick={() => {
                          setRoleFilter('User');
                          setRoleDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: "var(--hover-bg)" }}
                      >
                        User
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {(statusFilter || roleFilter) && (
              <motion.button
                onClick={() => {
                  setStatusFilter(null);
                  setRoleFilter(null);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear filters
              </motion.button>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <motion.input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
              initial={{ width: "100%" }}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </div>
        
        {/* Active filters */}
        <AnimatePresence>
          {(statusFilter || roleFilter) && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {statusFilter && (
                <motion.div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  Status: {statusFilter}
                  <motion.button 
                    onClick={() => setStatusFilter(null)}
                    className="ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle size={14} />
                  </motion.button>
                </motion.div>
              )}
              
              {roleFilter && (
                <motion.div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  Role: {roleFilter}
                  <motion.button 
                    onClick={() => setRoleFilter(null)}
                    className="ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle size={14} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Users table */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Bulk actions */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div 
              className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {selectedUsers.length} users selected
              </span>
              <div className="flex items-center gap-2">
                <motion.button 
                  className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={14} className="mr-1.5 inline-block" />
                  Email
                </motion.button>
                <motion.button 
                  className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={14} className="mr-1.5 inline-block" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Active</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <AnimatePresence>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <motion.tr 
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      whileHover="hover"
                      layout
                      transition={{
                        layout: { type: "spring", stiffness: 500, damping: 30 }
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="ml-3 flex items-center">
                            <motion.div 
                              className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium"
                              whileHover={{ scale: 1.1 }}
                            >
                              {getInitials(user.name)}
                            </motion.div>
                            <div className="ml-3">
                              <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(user.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {user.status === 'Active' && <CheckCircle2 size={12} className="mr-1" />}
                          {user.status === 'Suspended' && <XCircle size={12} className="mr-1" />}
                          {user.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyles(user.role)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {user.role === 'Admin' && <Shield size={12} className="mr-1" />}
                          {user.role}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {user.dateJoined}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button 
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button 
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      {searchQuery || statusFilter || roleFilter ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <p className="font-medium mb-1">No users match your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <p className="font-medium mb-1">No users found</p>
                          <p className="text-sm">Get started by adding a new user</p>
                        </motion.div>
                      )}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <motion.div 
            className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </motion.div>
  );
}