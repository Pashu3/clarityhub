"use client";

import React, { useState } from "react";
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
  Phone,
  Mail,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  BarChart,
  AlertCircle,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AddLeadModal, { LeadData } from "@/components/admin/modals/AddLeadModal";


export default function AdminLeadsPage() {
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  
  // Mock lead data
  const leads = [
    { 
      id: "1", 
      name: "Robert Chen", 
      company: "TechGrowth Solutions",
      email: "robert.chen@techgrowth.com", 
      phone: "+1 (415) 555-7890",
      status: "New", 
      source: "Website",
      value: "$12,000",
      dateAdded: "Apr 12, 2025",
      lastContact: "2 days ago",
      notes: "Interested in enterprise plan, scheduled demo next week"
    },
    { 
      id: "2", 
      name: "Jennifer Patel", 
      company: "MarketSmart Agency",
      email: "jennifer@marketsmart.co", 
      phone: "+1 (312) 555-3421",
      status: "Contacted", 
      source: "Referral",
      value: "$8,500",
      dateAdded: "Apr 8, 2025",
      lastContact: "Yesterday",
      notes: "Follow-up call scheduled for Friday"
    },
    { 
      id: "3", 
      name: "David Okonkwo", 
      company: "Global Insights Ltd",
      email: "david.o@globalinsights.com", 
      phone: "+1 (202) 555-9876",
      status: "Qualified", 
      source: "LinkedIn",
      value: "$24,000",
      dateAdded: "Mar 29, 2025",
      lastContact: "4 hours ago",
      notes: "Very promising, needs technical review"
    },
    { 
      id: "4", 
      name: "Maria Rodriguez", 
      company: "Innovate Financial",
      email: "m.rodriguez@innovatefinancial.com", 
      phone: "+1 (305) 555-6543",
      status: "Proposal", 
      source: "Conference",
      value: "$15,000",
      dateAdded: "Mar 15, 2025",
      lastContact: "1 week ago",
      notes: "Sent proposal, awaiting feedback"
    },
    { 
      id: "5", 
      name: "James Washington", 
      company: "DataStream Inc",
      email: "jwashington@datastream.io", 
      phone: "+1 (617) 555-2109",
      status: "Negotiation", 
      source: "Webinar",
      value: "$32,000",
      dateAdded: "Feb 28, 2025",
      lastContact: "3 days ago",
      notes: "Negotiating contract terms, legal review in progress"
    },
    { 
      id: "6", 
      name: "Sophia Kim", 
      company: "NextGen Retail",
      email: "sophia.kim@nextgenretail.com", 
      phone: "+1 (213) 555-8765",
      status: "Closed Won", 
      source: "Website",
      value: "$18,500",
      dateAdded: "Feb 10, 2025",
      lastContact: "1 day ago",
      notes: "Deal closed! Onboarding scheduled for next month"
    },
    { 
      id: "7", 
      name: "Thomas Meyer", 
      company: "EuroTech GmbH",
      email: "t.meyer@eurotech.de", 
      phone: "+1 (346) 555-4321",
      status: "Closed Lost", 
      source: "Partner",
      value: "$22,000",
      dateAdded: "Jan 25, 2025",
      lastContact: "2 weeks ago",
      notes: "Budget constraints, may revisit next quarter"
    },
  ];
  const handleAddLead = async (leadData: LeadData) => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const newLead = {
      id: Date.now().toString(),
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      status: leadData.status,
      source: leadData.source,
      value: leadData.value || "$0",
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastContact: "Just now",
      notes: leadData.notes
    };
    
    setLeads(prevLeads => [newLead, ...prevLeads]);
    
    // Return success
    return Promise.resolve();
  };
  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === null || lead.status === statusFilter;
    
    // Source filter
    const matchesSource = sourceFilter === null || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });
  
  // Pagination
  const leadsPerPage = 5;
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );
  
  // Toggle lead selection
  const toggleLeadSelection = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };
  
  // Toggle all leads selection
  const toggleAllSelection = () => {
    if (selectedLeads.length === paginatedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    }
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  // Get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Contacted':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Qualified':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'Proposal':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Negotiation':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'Closed Won':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Closed Lost':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Closed Won':
        return <CheckCircle2 size={14} className="mr-1" />;
      case 'Closed Lost':
        return <XCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Summary data for stats cards
  const summaryData = [
    { 
      title: "Total Leads", 
      value: leads.length,
      change: "+14%",
      trend: "up"
    },
    { 
      title: "Qualified Leads", 
      value: leads.filter(lead => lead.status === "Qualified" || lead.status === "Proposal" || lead.status === "Negotiation").length,
      change: "+5%",
      trend: "up"
    },
    { 
      title: "Conversion Rate", 
      value: "22%",
      change: "+3%",
      trend: "up"
    },
    { 
      title: "Avg Deal Value", 
      value: "$18.7K",
      change: "-2%",
      trend: "down"
    },
  ];

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
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Management</h1>
        
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Lead</span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Summary statistics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {summaryData.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-100 dark:border-slate-700"
            variants={item}
            whileHover={cardHover.hover}
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
            <motion.p 
              className="text-2xl font-bold mt-1 text-slate-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            >
              {stat.value}
            </motion.p>
            <div className="mt-2 flex items-center">
              <motion.span 
                className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                animate={{ 
                  y: [0, stat.trend === 'up' ? -3 : 3, 0],
                  transition: { 
                    repeat: 2, 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.1,
                    repeatType: "reverse"
                  }
                }}
              >
                {stat.change}
              </motion.span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">vs last month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Filter and search toolbar */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4"
        variants={item}
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
                      {["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"].map(status => (
                        <motion.button 
                          key={status}
                          className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                          onClick={() => {
                            setStatusFilter(status);
                            setStatusDropdownOpen(false);
                          }}
                          whileHover={{ x: 5, backgroundColor: "var(--hover-bg)" }}
                        >
                          {status}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <motion.button
                onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart size={16} className="mr-2" />
                <span>Source</span>
                <motion.div
                  animate={{ rotate: sourceDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="ml-2" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {sourceDropdownOpen && (
                  <motion.div 
                    className="absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      {["Website", "Referral", "LinkedIn", "Conference", "Webinar", "Partner"].map(source => (
                        <motion.button 
                          key={source}
                          className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                          onClick={() => {
                            setSourceFilter(source);
                            setSourceDropdownOpen(false);
                          }}
                          whileHover={{ x: 5, backgroundColor: "var(--hover-bg)" }}
                        >
                          {source}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {(statusFilter || sourceFilter) && (
              <motion.button
                onClick={() => {
                  setStatusFilter(null);
                  setSourceFilter(null);
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
              placeholder="Search leads..." 
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
          {(statusFilter || sourceFilter) && (
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
              
              {sourceFilter && (
                <motion.div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  Source: {sourceFilter}
                  <motion.button 
                    onClick={() => setSourceFilter(null)}
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
      
      {/* Leads table */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        variants={item}
        initial="hidden"
        animate="visible"
      >
        {/* Bulk actions */}
        <AnimatePresence>
          {selectedLeads.length > 0 && (
            <motion.div 
              className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {selectedLeads.length} leads selected
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
                  className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={14} className="mr-1.5 inline-block" />
                  Export
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
                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Lead</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Source</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Value</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Contact</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-slate-100 dark:divide-slate-700"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead, index) => (
                    <motion.tr 
                      key={lead.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      variants={item}
                      custom={index}
                      layout
                      whileHover={{ backgroundColor: "var(--hover-bg)", scale: 1.005 }}
                      transition={{
                        layout: { type: "spring", stiffness: 500, damping: 30 }
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="ml-3 flex items-center">
                            <motion.div 
                              className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium"
                              whileHover={{ scale: 1.1 }}
                            >
                              {getInitials(lead.name)}
                            </motion.div>
                            <div className="ml-3">
                              <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{lead.company}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(lead.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {getStatusIcon(lead.status)}
                          {lead.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {lead.value}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {lead.lastContact}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <motion.button 
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Phone size={16} />
                          </motion.button>
                          <motion.button 
                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Mail size={16} />
                          </motion.button>
                          <motion.button 
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button 
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreHorizontal size={16} />
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
                      {searchQuery || statusFilter || sourceFilter ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <p className="font-medium mb-1">No leads match your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <p className="font-medium mb-1">No leads found</p>
                          <p className="text-sm">Get started by adding a new lead</p>
                        </motion.div>
                      )}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <motion.div 
            className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * leadsPerPage) + 1} to {Math.min(currentPage * leadsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
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
      <AddLeadModal 
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />
    </motion.div>
  );
}