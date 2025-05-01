"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  RefreshCw,
  ShieldCheck,
  UserX,
  Users,
  FileText,
  Settings,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Import the separated components
import SecurityOverview from "@/components/admin/security/SecurityOverview";
import LoginAttempts from "@/components/admin/security/LoginAttempts";
import ActiveSessions from "@/components/admin/security/ActiveSessions";
import AuditLog from "@/components/admin/security/AuditLog";
import SecuritySettings from "@/components/admin/security/SecuritySettings";

export default function AdminSecurityPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'loginAttempts' | 'sessions' | 'audit' | 'settings'>('overview');

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d');

  // Mock security alerts data
  const securityAlerts = [
    { 
      id: "1", 
      title: "Multiple failed login attempts", 
      description: "5 failed login attempts for admin@clarityhub.com from IP 198.51.100.24",
      severity: "High",
      status: "Active",
      time: "45 minutes ago",
      date: "2025-04-27",
      user: "admin@clarityhub.com",
      ip: "198.51.100.24",
      location: "Stockholm, Sweden"
    },
    { 
      id: "2", 
      title: "Suspicious file upload detected", 
      description: "Potentially malicious file uploaded by user smith@example.com",
      severity: "High",
      status: "Investigating",
      time: "2 hours ago",
      date: "2025-04-27",
      user: "smith@example.com",
      ip: "203.0.113.42",
      location: "Toronto, Canada"
    },
    { 
      id: "3", 
      title: "New admin user created", 
      description: "New administrator account created for olivia.parker@clarityhub.com",
      severity: "Medium",
      status: "Resolved",
      time: "Yesterday",
      date: "2025-04-26",
      user: "james.wilson@clarityhub.com",
      ip: "192.0.2.128",
      location: "New York, USA"
    },
    { 
      id: "4", 
      title: "Unusual access pattern detected", 
      description: "User john.doe@example.com accessed 75 sensitive records in 10 minutes",
      severity: "Medium",
      status: "Active",
      time: "Yesterday",
      date: "2025-04-26",
      user: "john.doe@example.com",
      ip: "203.0.113.100",
      location: "Seattle, USA"
    },
    { 
      id: "5", 
      title: "API rate limit exceeded", 
      description: "API rate limit exceeded for integration client ID: client_94857",
      severity: "Low",
      status: "Resolved",
      time: "2 days ago",
      date: "2025-04-25",
      user: "API Integration",
      ip: "198.51.100.80",
      location: "Frankfurt, Germany"
    },
    { 
      id: "6", 
      title: "Password policy violation", 
      description: "User emily.johnson@example.com attempted to set a password that doesn't meet requirements",
      severity: "Low",
      status: "Resolved",
      time: "3 days ago",
      date: "2025-04-24",
      user: "emily.johnson@example.com",
      ip: "203.0.113.202",
      location: "Sydney, Australia"
    },
    { 
      id: "7", 
      title: "Concurrent session limit reached", 
      description: "User mark.taylor@clarityhub.com reached maximum concurrent session limit",
      severity: "Medium",
      status: "Active",
      time: "3 days ago",
      date: "2025-04-24",
      user: "mark.taylor@clarityhub.com",
      ip: "Multiple",
      location: "Multiple locations"
    },
  ];

  // Mock login attempts data
  const loginAttempts = [
    { 
      id: "1", 
      user: "admin@clarityhub.com", 
      status: "Failed",
      ip: "198.51.100.24",
      time: "45 minutes ago",
      date: "2025-04-27",
      location: "Stockholm, Sweden",
      device: "Chrome 114 / Windows",
      reason: "Invalid password"
    },
    { 
      id: "2", 
      user: "admin@clarityhub.com", 
      status: "Failed",
      ip: "198.51.100.24",
      time: "46 minutes ago",
      date: "2025-04-27",
      location: "Stockholm, Sweden",
      device: "Chrome 114 / Windows",
      reason: "Invalid password"
    },
    { 
      id: "3", 
      user: "admin@clarityhub.com", 
      status: "Failed",
      ip: "198.51.100.24",
      time: "47 minutes ago",
      date: "2025-04-27",
      location: "Stockholm, Sweden",
      device: "Chrome 114 / Windows",
      reason: "Invalid password"
    },
    { 
      id: "4", 
      user: "james.wilson@clarityhub.com", 
      status: "Success",
      ip: "192.0.2.128",
      time: "1 hour ago",
      date: "2025-04-27",
      location: "New York, USA",
      device: "Firefox 98 / MacOS",
      reason: null
    },
    { 
      id: "5", 
      user: "sarah.parker@example.com", 
      status: "Success",
      ip: "203.0.113.55",
      time: "3 hours ago",
      date: "2025-04-27",
      location: "London, UK",
      device: "Safari 15 / iOS",
      reason: null
    },
    { 
      id: "6", 
      user: "david.miller@clarityhub.com", 
      status: "Failed",
      ip: "192.0.2.200",
      time: "5 hours ago",
      date: "2025-04-27",
      location: "Chicago, USA",
      device: "Edge 99 / Windows",
      reason: "Account locked"
    },
    { 
      id: "7", 
      user: "unknown", 
      status: "Failed",
      ip: "203.0.113.190",
      time: "6 hours ago",
      date: "2025-04-27",
      location: "Beijing, China",
      device: "Unknown",
      reason: "User not found"
    },
  ];

  // Mock active sessions data
  const activeSessions = [
    { 
      id: "1", 
      user: "admin@clarityhub.com", 
      ip: "192.0.2.50",
      started: "2 hours ago",
      lastActivity: "5 minutes ago",
      location: "New York, USA",
      device: "Chrome 114 / MacOS",
      type: "Web"
    },
    { 
      id: "2", 
      user: "james.wilson@clarityhub.com", 
      ip: "192.0.2.128",
      started: "1 hour ago",
      lastActivity: "12 minutes ago",
      location: "New York, USA",
      device: "Firefox 98 / MacOS",
      type: "Web"
    },
    { 
      id: "3", 
      user: "sarah.parker@example.com", 
      ip: "203.0.113.55",
      started: "3 hours ago",
      lastActivity: "20 minutes ago",
      location: "London, UK",
      device: "Safari 15 / iOS",
      type: "Mobile"
    },
    { 
      id: "4", 
      user: "michael.brown@clarityhub.com", 
      ip: "198.51.100.75",
      started: "6 hours ago",
      lastActivity: "28 minutes ago",
      location: "Austin, USA",
      device: "Chrome 114 / Android",
      type: "Mobile"
    },
    { 
      id: "5", 
      user: "emma.davis@example.com", 
      ip: "203.0.113.22",
      started: "8 hours ago",
      lastActivity: "1 hour ago",
      location: "Paris, France",
      device: "Edge 99 / Windows",
      type: "Web"
    },
    { 
      id: "6", 
      user: "API Integration (Client ID: client_94857)", 
      ip: "198.51.100.80",
      started: "2 days ago",
      lastActivity: "35 minutes ago",
      location: "Frankfurt, Germany",
      device: "API Client",
      type: "API"
    },
  ];

  // Mock audit log data
  const auditLog = [
    { 
      id: "1", 
      action: "User updated", 
      description: "Modified permissions for user david.miller@clarityhub.com",
      user: "admin@clarityhub.com",
      time: "22 minutes ago",
      date: "2025-04-27",
      ip: "192.0.2.50",
      resource: "users/david-miller",
      details: "Changed role from Editor to Admin"
    },
    { 
      id: "2", 
      action: "Security setting changed", 
      description: "Updated password policy to require minimum 12 characters",
      user: "admin@clarityhub.com",
      time: "1 hour ago",
      date: "2025-04-27",
      ip: "192.0.2.50",
      resource: "settings/security",
      details: "Changed min password length from 8 to 12"
    },
    { 
      id: "3", 
      action: "API key created", 
      description: "New API key generated for integration with Salesforce",
      user: "james.wilson@clarityhub.com",
      time: "3 hours ago",
      date: "2025-04-27",
      ip: "192.0.2.128",
      resource: "api-keys",
      details: "Key ID: api_key_78453 with read-only permissions"
    },
    { 
      id: "4", 
      action: "User created", 
      description: "New user account created for olivia.parker@clarityhub.com",
      user: "james.wilson@clarityhub.com",
      time: "Yesterday",
      date: "2025-04-26",
      ip: "192.0.2.128",
      resource: "users/olivia-parker",
      details: "Assigned Editor role, invitation email sent"
    },
    { 
      id: "5", 
      action: "Data export", 
      description: "Exported customer data for Q1 2025 analysis",
      user: "sarah.parker@example.com",
      time: "Yesterday",
      date: "2025-04-26",
      ip: "203.0.113.55",
      resource: "data/customers",
      details: "CSV export, 2,456 records"
    },
    { 
      id: "6", 
      action: "User locked", 
      description: "User account locked after 5 failed login attempts",
      user: "System",
      time: "2 days ago",
      date: "2025-04-25",
      ip: "System",
      resource: "users/david-miller",
      details: "Automatic lock after multiple failed attempts"
    },
    { 
      id: "7", 
      action: "2FA disabled", 
      description: "Two-factor authentication disabled for user account",
      user: "michael.brown@clarityhub.com",
      time: "3 days ago",
      date: "2025-04-24",
      ip: "198.51.100.75",
      resource: "users/michael-brown/security",
      details: "User self-service action"
    },
  ];

  // Summary stats
  const securityStats = [
    { 
      title: "Security Score", 
      value: "87/100",
      change: "+5",
      trend: "up",
      icon: ShieldCheck
    },
    { 
      title: "Active Alerts", 
      value: securityAlerts.filter(a => a.status === "Active").length,
      change: "-2",
      trend: "down",
      icon: AlertTriangle
    },
    { 
      title: "Failed Logins", 
      value: "18",
      change: "+4",
      trend: "up",
      icon: UserX
    },
    { 
      title: "Active Sessions", 
      value: activeSessions.length,
      change: "+2",
      trend: "up",
      icon: Users
    },
  ];

  // Security recommendations
  const securityRecommendations = [
    {
      id: "1",
      title: "Enable multi-factor authentication for all admin users",
      priority: "High",
      status: "Pending",
      description: "3 admin users don't have MFA enabled"
    },
    {
      id: "2",
      title: "Review API keys older than 90 days",
      priority: "Medium",
      status: "In Progress",
      description: "5 API keys should be rotated"
    },
    {
      id: "3",
      title: "Update password policy",
      priority: "Medium",
      status: "Completed",
      description: "Policy updated on Apr 27, 2025"
    },
    {
      id: "4",
      title: "Enable IP restrictions for admin access",
      priority: "High",
      status: "Pending",
      description: "Restrict admin access to specific IP ranges"
    },
  ];

  // Filter security alerts based on search and filters
  const filteredAlerts = securityAlerts.filter(alert => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Severity filter
    const matchesSeverity = severityFilter === null || alert.severity === severityFilter;
    
    // Status filter
    const matchesStatus = statusFilter === null || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Filter login attempts based on search
  const filteredLoginAttempts = loginAttempts.filter(attempt => {
    return searchQuery.trim() === "" || 
      attempt.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter audit log based on search
  const filteredAuditLog = auditLog.filter(log => {
    return searchQuery.trim() === "" || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Items per page
  const itemsPerPage = 5;

  // Pagination for different tabs
  const getPaginatedItems = () => {
    let filteredItems: any[] = [];
    
    switch(activeTab) {
      case 'loginAttempts':
        filteredItems = filteredLoginAttempts;
        break;
      case 'audit':
        filteredItems = filteredAuditLog;
        break;
      default:
        filteredItems = filteredAlerts;
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

  // Get severity badge styling
  const getSeverityBadgeStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };

  // Get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Investigating':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Success':
      case 'Completed':
        return <Check size={14} className="mr-1" />;
      case 'Failed':
      case 'Active':
        return <X size={14} className="mr-1" />;
      default:
        return null;
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

  // Reset current page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter, severityFilter]);

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
          <Shield className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          Security & Compliance
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <button className="flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange === '24h' ? 'Last 24 hours' : dateRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
          
          <button className="p-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <RefreshCw size={18} />
          </button>
        </motion.div>
      </div>
      
      {/* Security Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {securityStats.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' && stat.title !== 'Failed Logins' && stat.title !== 'Active Alerts' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : stat.trend === 'down' && (stat.title === 'Failed Logins' || stat.title === 'Active Alerts') ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</p>
            <div className="mt-2 flex items-center">
              <span className={`text-xs font-medium ${
                (stat.trend === 'up' && stat.title !== 'Failed Logins' && stat.title !== 'Active Alerts') || 
                (stat.trend === 'down' && (stat.title === 'Failed Logins' || stat.title === 'Active Alerts')) 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
              {((stat.trend === 'up' && stat.title !== 'Failed Logins' && stat.title !== 'Active Alerts') || 
                (stat.trend === 'down' && (stat.title === 'Failed Logins' || stat.title === 'Active Alerts'))) ? 
                <ArrowUpRight className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" /> : 
                <ArrowDownRight className="h-3 w-3 ml-1 text-red-600 dark:text-red-400" />
              }
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">past 7 days</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
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
          <ShieldCheck className="mr-2 h-4 w-4" />
          Overview
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'loginAttempts' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('loginAttempts')}
          variants={tabVariants}
          animate={activeTab === 'loginAttempts' ? 'active' : 'inactive'}
        >
          <UserX className="mr-2 h-4 w-4" />
          Login Attempts
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'sessions' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('sessions')}
          variants={tabVariants}
          animate={activeTab === 'sessions' ? 'active' : 'inactive'}
        >
          <Users className="mr-2 h-4 w-4" />
          Active Sessions
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'audit' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('audit')}
          variants={tabVariants}
          animate={activeTab === 'audit' ? 'active' : 'inactive'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Audit Log
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
          Security Settings
        </motion.button>
      </motion.div>
      
      {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'sessions' && (
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {activeTab === 'loginAttempts' && (
                <div className="relative">
                  <button
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Status</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              )}
              
              {activeTab === 'audit' && (
                <div className="relative">
                  <button
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Action Type</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              )}
              
              {(severityFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setSeverityFilter(null);
                    setStatusFilter(null);
                  }}
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
                placeholder={`Search ${activeTab === 'loginAttempts' ? 'login attempts' : activeTab === 'audit' ? 'audit log' : 'alerts'}...`}
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
          <SecurityOverview 
            securityRecommendations={securityRecommendations}
            securityAlerts={securityAlerts}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getSeverityBadgeStyles={getSeverityBadgeStyles}
            getStatusIcon={getStatusIcon}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'loginAttempts' && (
          <LoginAttempts 
            paginatedItems={paginatedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredLoginAttempts={filteredLoginAttempts}
            itemsPerPage={itemsPerPage}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getStatusIcon={getStatusIcon}
          />
        )}
        
        {activeTab === 'sessions' && (
          <ActiveSessions 
            activeSessions={activeSessions}
          />
        )}
        
        {activeTab === 'audit' && (
          <AuditLog 
            paginatedItems={paginatedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredAuditLog={filteredAuditLog}
            itemsPerPage={itemsPerPage}
          />
        )}
        
        {activeTab === 'settings' && (
          <SecuritySettings />
        )}
      </AnimatePresence>
    </motion.div>
  );
}