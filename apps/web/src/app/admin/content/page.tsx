"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Image,
  FileCode,
  Copy,
  MoreHorizontal,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  HelpCircle,
  FileQuestion,
  Video,
  MessageSquare,
  Settings
} from "lucide-react";
import Link from "next/link";

// Import components
import AllContent from "@/components/admin/content/AllContent";
import ArticlesAndGuides from "@/components/admin/content/ArticlesAndGuides";
import Documentation from "@/components/admin/content/Documentation";
import Faqs from "@/components/admin/content/Faqs";
import AddNewContent from "@/components/admin/content/AddNewContent";

export default function AdminContentPage() {
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'docs' | 'faqs'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [content, setContent] = useState([
    { 
      id: "1", 
      title: "Getting Started with ClarityHub", 
      type: "Guide",
      status: "Published",
      category: "Onboarding",
      author: "Emily Johnson",
      lastUpdated: "April 22, 2025",
      views: 2480,
      readTime: "8 min",
      image: "/images/content-1.jpg"
    },
    { 
      id: "2", 
      title: "Advanced Analytics Features", 
      type: "Documentation",
      status: "Published",
      category: "Features",
      author: "Michael Smith",
      lastUpdated: "April 15, 2025",
      views: 1340,
      readTime: "12 min",
      image: "/images/content-2.jpg"
    },
    { 
      id: "3", 
      title: "Troubleshooting Data Import Issues", 
      type: "FAQ",
      status: "Published",
      category: "Support",
      author: "Sarah Wilson",
      lastUpdated: "April 10, 2025",
      views: 3650,
      readTime: "5 min",
      image: null
    },
    { 
      id: "4", 
      title: "Custom Dashboard Creation", 
      type: "Tutorial",
      status: "Draft",
      category: "Features",
      author: "David Brown",
      lastUpdated: "April 8, 2025",
      views: 0,
      readTime: "10 min",
      image: "/images/content-4.jpg"
    },
    { 
      id: "5", 
      title: "Data Security Best Practices", 
      type: "Guide",
      status: "Under Review",
      category: "Security",
      author: "Jessica Lee",
      lastUpdated: "April 5, 2025",
      views: 0,
      readTime: "15 min",
      image: "/images/content-5.jpg"
    },
    { 
      id: "6", 
      title: "Integrating with Third-Party Tools", 
      type: "Documentation",
      status: "Published",
      category: "Integrations",
      author: "Thomas Martinez",
      lastUpdated: "March 28, 2025",
      views: 1870,
      readTime: "18 min",
      image: "/images/content-6.jpg"
    },
    { 
      id: "7", 
      title: "How to Reset Your Password", 
      type: "FAQ",
      status: "Published",
      category: "Account",
      author: "Olivia Garcia",
      lastUpdated: "March 22, 2025",
      views: 5240,
      readTime: "2 min",
      image: null
    },
    { 
      id: "8", 
      title: "Creating Custom Reports", 
      type: "Tutorial",
      status: "Published",
      category: "Features",
      author: "Emily Johnson",
      lastUpdated: "March 15, 2025",
      views: 2180,
      readTime: "14 min",
      image: "/images/content-8.jpg"
    },
    { 
      id: "9", 
      title: "Team Collaboration Features", 
      type: "Guide",
      status: "Archived",
      category: "Features",
      author: "Michael Smith",
      lastUpdated: "February 28, 2025",
      views: 1250,
      readTime: "9 min",
      image: "/images/content-9.jpg"
    },
  ]);
  
  // Summary statistics
  const contentStats = [
    { 
      title: "Total Content", 
      value: content.length,
      change: "+3",
      trend: "up",
      icon: FileText
    },
    { 
      title: "Published", 
      value: content.filter(item => item.status === "Published").length,
      change: "+2",
      trend: "up",
      icon: CheckCircle2
    },
    { 
      title: "Avg. Read Time", 
      value: "10m",
      change: "-2m",
      trend: "down",
      icon: Clock
    },
    { 
      title: "Total Views", 
      value: "18.5K",
      change: "+24%",
      trend: "up",
      icon: Eye
    },
  ];
  
  // Filter content based on search, type, status and tab
  const filteredContent = content.filter(item => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === null || item.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === null || item.status === statusFilter;
    
    // Tab filter
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'articles' && (item.type === 'Guide' || item.type === 'Tutorial')) ||
      (activeTab === 'docs' && item.type === 'Documentation') ||
      (activeTab === 'faqs' && item.type === 'FAQ');
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });
  
  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Toggle content selection
  const toggleContentSelection = (contentId: string) => {
    if (selectedContent.includes(contentId)) {
      setSelectedContent(selectedContent.filter(id => id !== contentId));
    } else {
      setSelectedContent([...selectedContent, contentId]);
    }
  };
  
  // Toggle all content selection
  const toggleAllSelection = () => {
    if (selectedContent.length === paginatedContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(paginatedContent.map(item => item.id));
    }
  };
  
  // Get status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Draft':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
      case 'Under Review':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Archived':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Guide':
        return <BookOpen size={16} />;
      case 'Documentation':
        return <FileCode size={16} />;
      case 'FAQ':
        return <MessageSquare size={16} />;
      case 'Tutorial':
        return <Video size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  // Handle saving new content
  const handleSaveContent = (newContentData: any) => {
    setContent([newContentData, ...content]);
  };

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
          className="text-2xl font-bold text-slate-900 dark:text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Content Management
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            onClick={() => setShowAddContentModal(true)}
          >
            <Plus size={16} />
            <span>New Content</span>
          </button>
        </motion.div>
      </div>
      
      {/* Summary statistics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {contentStats.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-100 dark:border-slate-700"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</p>
            <div className="mt-2 flex items-center">
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
              {stat.trend === 'up' ? 
                <ArrowUpRight className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" /> : 
                <ArrowDownRight className="h-3 w-3 ml-1 text-red-600 dark:text-red-400" />
              }
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">past month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Tabs */}
      <motion.div 
        className="flex border-b border-slate-200 dark:border-slate-700 mb-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'all' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('all')}
          variants={tabVariants}
          animate={activeTab === 'all' ? 'active' : 'inactive'}
        >
          All Content
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'articles' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('articles')}
          variants={tabVariants}
          animate={activeTab === 'articles' ? 'active' : 'inactive'}
        >
          Articles & Guides
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'docs' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('docs')}
          variants={tabVariants}
          animate={activeTab === 'docs' ? 'active' : 'inactive'}
        >
          Documentation
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'faqs' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('faqs')}
          variants={tabVariants}
          animate={activeTab === 'faqs' ? 'active' : 'inactive'}
        >
          FAQs
        </motion.button>
      </motion.div>
      
      {/* Filter and search toolbar */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setTypeFilter(null)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Filter size={16} className="mr-2" />
                <span>Type</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <div className="absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10 hidden">
                <div className="py-1">
                  {["Guide", "Documentation", "FAQ", "Tutorial"].map(type => (
                    <button 
                      key={type}
                      className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setStatusFilter(null)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <CheckCircle2 size={16} className="mr-2" />
                <span>Status</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              <div className="absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10 hidden">
                <div className="py-1">
                  {["Published", "Draft", "Under Review", "Archived"].map(status => (
                    <button 
                      key={status}
                      className="block px-4 py-2 text-sm w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {(typeFilter || statusFilter) && (
              <button
                onClick={() => {
                  setTypeFilter(null);
                  setStatusFilter(null);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search content..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
              />
            </div>
            
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button 
                className={`p-2 ${viewMode === 'list' 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                onClick={() => setViewMode('list')}
              >
                <FileText size={16} />
              </button>
              <button 
                className={`p-2 ${viewMode === 'grid' 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                onClick={() => setViewMode('grid')}
              >
                <Image size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Active filters */}
        {(typeFilter || statusFilter) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {typeFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                Type: {typeFilter}
                <button 
                  onClick={() => setTypeFilter(null)}
                  className="ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <XCircle size={14} />
                </button>
              </div>
            )}
            
            {statusFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                Status: {statusFilter}
                <button 
                  onClick={() => setStatusFilter(null)}
                  className="ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <XCircle size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Bulk actions */}
      <AnimatePresence>
        {selectedContent.length > 0 && (
          <motion.div 
            className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border rounded-xl border-purple-100 dark:border-purple-800/40 flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {selectedContent.length} items selected
            </span>
            <div className="flex items-center gap-2">
              <button className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700">
                <CheckCircle2 size={14} className="mr-1.5 inline-block" />
                Publish
              </button>
              <button className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700">
                <Copy size={14} className="mr-1.5 inline-block" />
                Duplicate
              </button>
              <button className="text-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-700">
                <Trash2 size={14} className="mr-1.5 inline-block" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content Views */}
      <AnimatePresence mode="wait">
        {activeTab === 'all' && (
          <AllContent
            paginatedContent={paginatedContent}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            selectedContent={selectedContent}
            toggleContentSelection={toggleContentSelection}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getTypeIcon={getTypeIcon}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        
        {activeTab === 'articles' && (
          <ArticlesAndGuides
            paginatedContent={paginatedContent}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            selectedContent={selectedContent}
            toggleContentSelection={toggleContentSelection}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getTypeIcon={getTypeIcon}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        
        {activeTab === 'docs' && (
          <Documentation
            paginatedContent={paginatedContent}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            selectedContent={selectedContent}
            toggleContentSelection={toggleContentSelection}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getTypeIcon={getTypeIcon}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        
        {activeTab === 'faqs' && (
          <Faqs
            paginatedContent={paginatedContent}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            selectedContent={selectedContent}
            toggleContentSelection={toggleContentSelection}
            getStatusBadgeStyles={getStatusBadgeStyles}
            getTypeIcon={getTypeIcon}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
      </AnimatePresence>
      
      {/* Pagination */}
      {filteredContent.length > 0 && (
        <motion.div 
          className="mt-6 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContent.length)} of {filteredContent.length} items
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
      
      {/* Add New Content Modal */}
      <AddNewContent 
        isOpen={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        onSave={handleSaveContent}
      />
    </motion.div>
  );
}