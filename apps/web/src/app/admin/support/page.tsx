"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LifeBuoy, 
  Calendar,
  ChevronDown,
  RefreshCw,
  Check,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Inbox,
  MessageSquareDashed,
  FileQuestion,
  Settings,
  MessageSquarePlus
} from "lucide-react";

// Import the separated components
import SupportOverview from "@/components/admin/support/SupportOverview";
import SupportTickets from "@/components/admin/support/SupportTickets";
import LiveChat from "@/components/admin/support/LiveChat";
import KnowledgeBase from "@/components/admin/support/KnowledgeBase";
import SupportSettings from "@/components/admin/support/SupportSettings";

export default function AdminSupportPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'chat' | 'knowledge' | 'settings'>('overview');

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d');

  // Chat state
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Mock support tickets data
  const supportTickets = [
    { 
      id: "T-1042", 
      subject: "Can't access analytics dashboard", 
      description: "I'm getting an error when trying to load the analytics dashboard: Error code 403.",
      priority: "High",
      status: "Open",
      time: "35 minutes ago",
      date: "2025-04-27",
      user: "emma.davis@example.com",
      category: "Dashboard",
      assignee: "james.wilson@clarityhub.com"
    },
    { 
      id: "T-1041", 
      subject: "Integration with Salesforce not working", 
      description: "After the latest update, our Salesforce integration has stopped syncing data.",
      priority: "High",
      status: "In Progress",
      time: "2 hours ago",
      date: "2025-04-27",
      user: "john.smith@example.com",
      category: "Integrations",
      assignee: "michael.brown@clarityhub.com"
    },
    { 
      id: "T-1040", 
      subject: "Need help with custom report setup", 
      description: "I'm trying to create a custom report but can't find the right options.",
      priority: "Medium",
      status: "Open",
      time: "Yesterday",
      date: "2025-04-26",
      user: "sarah.parker@example.com",
      category: "Reporting",
      assignee: null
    },
    { 
      id: "T-1039", 
      subject: "Data import failed", 
      description: "My CSV import failed with error message: 'Invalid date format in row 23'.",
      priority: "Medium",
      status: "Open",
      time: "Yesterday",
      date: "2025-04-26",
      user: "david.miller@clarityhub.com",
      category: "Data Import",
      assignee: "admin@clarityhub.com"
    },
    { 
      id: "T-1038", 
      subject: "How to add team members?", 
      description: "I need to invite 5 new team members but I can't find this option in my account.",
      priority: "Low",
      status: "Closed",
      time: "2 days ago",
      date: "2025-04-25",
      user: "robert.johnson@example.com",
      category: "Account Management",
      assignee: "james.wilson@clarityhub.com"
    },
    { 
      id: "T-1037", 
      subject: "Billing question about invoice", 
      description: "I was charged twice on my last invoice. Can you help me resolve this?",
      priority: "Medium",
      status: "Closed",
      time: "3 days ago",
      date: "2025-04-24",
      user: "jennifer.lopez@example.com",
      category: "Billing",
      assignee: "admin@clarityhub.com"
    },
    { 
      id: "T-1036", 
      subject: "Feature request: Dark mode", 
      description: "Would it be possible to add a dark mode option to the platform?",
      priority: "Low",
      status: "Closed",
      time: "4 days ago",
      date: "2025-04-23",
      user: "alex.wong@example.com",
      category: "Feature Request",
      assignee: "michael.brown@clarityhub.com"
    },
  ];

  // Mock ticket messages
  const ticketMessages = [
    {
      ticketId: "T-1042",
      messages: [
        {
          id: "msg-1",
          sender: "emma.davis@example.com",
          content: "I'm getting an error when trying to load the analytics dashboard: Error code 403. I've tried clearing my cache and using a different browser, but the issue persists.",
          time: "35 minutes ago",
          date: "2025-04-27",
          attachments: ["screenshot-error.png"]
        },
        {
          id: "msg-2",
          sender: "james.wilson@clarityhub.com",
          content: "Hi Emma, I'm sorry you're experiencing this issue. Let me check your account permissions. Could you please confirm when this issue started happening? Was it working before?",
          time: "28 minutes ago",
          date: "2025-04-27",
          attachments: []
        },
        {
          id: "msg-3",
          sender: "emma.davis@example.com",
          content: "It was working fine yesterday. The issue started this morning when I tried to access the dashboard.",
          time: "24 minutes ago",
          date: "2025-04-27",
          attachments: []
        }
      ]
    },
    {
      ticketId: "T-1041",
      messages: [
        {
          id: "msg-1",
          sender: "john.smith@example.com",
          content: "After the latest update, our Salesforce integration has stopped syncing data. The last successful sync was yesterday at 3 PM.",
          time: "2 hours ago",
          date: "2025-04-27",
          attachments: ["integration-log.txt"]
        },
        {
          id: "msg-2",
          sender: "michael.brown@clarityhub.com",
          content: "Hi John, I'm looking into this issue. We did deploy an update to our integration service yesterday evening. Let me check the logs to see what might be happening.",
          time: "1 hour ago",
          date: "2025-04-27",
          attachments: []
        }
      ]
    }
  ];

  // Knowledge base articles
  const knowledgeArticles = [
    {
      id: "KB-001",
      title: "Getting Started with ClarityHub",
      category: "Onboarding",
      views: 4256,
      lastUpdated: "2025-03-15"
    },
    {
      id: "KB-002",
      title: "Setting Up Your First Dashboard",
      category: "Dashboard",
      views: 3127,
      lastUpdated: "2025-04-02"
    },
    {
      id: "KB-003",
      title: "Integrating with Salesforce",
      category: "Integrations",
      views: 2845,
      lastUpdated: "2025-04-10"
    },
    {
      id: "KB-004",
      title: "User Permissions and Roles",
      category: "Account Management",
      views: 2211,
      lastUpdated: "2025-03-22"
    },
    {
      id: "KB-005",
      title: "Importing and Exporting Data",
      category: "Data Management",
      views: 1987,
      lastUpdated: "2025-04-05"
    },
    {
      id: "KB-006",
      title: "Billing and Subscription FAQ",
      category: "Billing",
      views: 1756,
      lastUpdated: "2025-03-18"
    }
  ];

  // Support statistics
  const supportStats = [
    { 
      title: "Open Tickets", 
      value: supportTickets.filter(t => t.status === "Open").length,
      change: "+2",
      trend: "up",
      icon: Inbox
    },
    { 
      title: "Avg. Response Time", 
      value: "28 min",
      change: "-5 min",
      trend: "down",
      icon: Calendar
    },
    { 
      title: "Customer Satisfaction", 
      value: "94%",
      change: "+2%",
      trend: "up",
      icon: BarChart2
    },
    { 
      title: "Knowledge Base Views", 
      value: "5.2K",
      change: "+420",
      trend: "up",
      icon: FileQuestion
    },
  ];

  // Filter tickets based on search and filters
  const filteredTickets = supportTickets.filter(ticket => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Priority filter
    const matchesPriority = priorityFilter === null || ticket.priority === priorityFilter;
    
    // Status filter
    const matchesStatus = statusFilter === null || ticket.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Items per page
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Pagination for tickets
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get priority badge styling
  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
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
      case 'Open':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Closed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Closed':
        return <Check size={14} className="mr-1" />;
      case 'Open':
        return <AlertCircle size={14} className="mr-1" />;
      case 'In Progress':
        return <Clock size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Animation variants for tabs
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
          <LifeBuoy className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          Customer Support
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
          
          <button className="px-3 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Ticket
          </button>
        </motion.div>
      </div>
      
      {/* Support Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {supportStats.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' && stat.title !== 'Open Tickets' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : stat.trend === 'down' && stat.title === 'Avg. Response Time' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</p>
            <div className="mt-2 flex items-center">
              <span className={`text-xs font-medium ${
                (stat.trend === 'up' && stat.title !== 'Open Tickets') || 
                (stat.trend === 'down' && stat.title === 'Avg. Response Time') 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
              {((stat.trend === 'up' && stat.title !== 'Open Tickets') || 
                (stat.trend === 'down' && stat.title === 'Avg. Response Time')) ? 
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
          <BarChart2 className="mr-2 h-4 w-4" />
          Overview
        </motion.button>
        
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'tickets' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('tickets')}
          variants={tabVariants}
          animate={activeTab === 'tickets' ? 'active' : 'inactive'}
        >
          <Inbox className="mr-2 h-4 w-4" />
          Support Tickets
        </motion.button>
        
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'chat' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('chat')}
          variants={tabVariants}
          animate={activeTab === 'chat' ? 'active' : 'inactive'}
        >
          <MessageSquareDashed className="mr-2 h-4 w-4" />
          Live Chat
        </motion.button>
        
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'knowledge' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('knowledge')}
          variants={tabVariants}
          animate={activeTab === 'knowledge' ? 'active' : 'inactive'}
        >
          <FileQuestion className="mr-2 h-4 w-4" />
          Knowledge Base
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
          Support Settings
        </motion.button>
      </motion.div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <SupportOverview 
            supportTickets={supportTickets}
            knowledgeArticles={knowledgeArticles}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'tickets' && (
          <SupportTickets 
            paginatedTickets={paginatedTickets}
            supportTickets={supportTickets}
            ticketMessages={ticketMessages}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredTickets={filteredTickets}
            itemsPerPage={itemsPerPage}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            replyText={replyText}
            setReplyText={setReplyText}
            getPriorityBadgeStyles={getPriorityBadgeStyles}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getStatusIcon={getStatusIcon}
          />
        )}
        
        {activeTab === 'chat' && (
          <LiveChat />
        )}
        
        {activeTab === 'knowledge' && (
          <KnowledgeBase 
            knowledgeArticles={knowledgeArticles}
          />
        )}
        
        {activeTab === 'settings' && (
          <SupportSettings />
        )}
      </AnimatePresence>
    </motion.div>
  );
}