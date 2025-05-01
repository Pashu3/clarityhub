"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Paperclip, 
  Send, 
  Check,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ChevronDown
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

interface SupportTicketsProps {
  paginatedTickets: any[];
  supportTickets: any[];
  ticketMessages: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: string | null;
  setPriorityFilter: (filter: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (filter: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredTickets: any[];
  itemsPerPage: number;
  selectedTicket: string | null;
  setSelectedTicket: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  getPriorityBadgeStyles: (priority: string) => string;
  getStatusBadgeStyles: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element | null;
}

export default function SupportTickets({
  paginatedTickets,
  supportTickets,
  ticketMessages,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredTickets,
  itemsPerPage,
  selectedTicket,
  setSelectedTicket,
  replyText,
  setReplyText,
  getPriorityBadgeStyles,
  getStatusBadgeStyles,
  getStatusIcon
}: SupportTicketsProps) {
  return (
    <>
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <button
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Filter size={16} className="mr-2" />
                <span>Priority</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              {/* Dropdown menu would go here */}
            </div>

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
            
            {(priorityFilter || statusFilter) && (
              <button
                onClick={() => {
                  setPriorityFilter(null);
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
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        key="tickets"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTicket ? (
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="mr-3 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    {supportTickets.find(t => t.id === selectedTicket)?.subject}
                  </h3>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{selectedTicket}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeStyles(supportTickets.find(t => t.id === selectedTicket)?.priority || '')}`}>
                  {supportTickets.find(t => t.id === selectedTicket)?.priority}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(supportTickets.find(t => t.id === selectedTicket)?.status || '')}`}>
                  {getStatusIcon(supportTickets.find(t => t.id === selectedTicket)?.status || '')}
                  {supportTickets.find(t => t.id === selectedTicket)?.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 h-[400px] overflow-y-auto">
              {ticketMessages.find(t => t.ticketId === selectedTicket)?.messages.map((message: any, index: number) => (
                <div 
                  key={message.id} 
                  className={`mb-6 ${
                    message.sender.includes('clarityhub.com') ? 'flex flex-row-reverse' : 'flex'
                  }`}
                >
                  <div 
                    className={`flex-none w-10 h-10 rounded-full mr-3 ml-3 grid place-items-center text-white ${
                      message.sender.includes('clarityhub.com') ? 'bg-purple-600' : 'bg-blue-600'
                    }`}
                  >
                    {message.sender.split('@')[0].charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex-grow max-w-[75%] ${
                    message.sender.includes('clarityhub.com') ? 'text-right' : 'text-left'
                  }`}>
                    <div 
                      className={`p-4 rounded-lg ${
                        message.sender.includes('clarityhub.com') 
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-slate-900 dark:text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      {message.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                          {message.attachments.map((attachment: string, i: number) => (
                            <div 
                              key={i} 
                              className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1"
                            >
                              <Paperclip size={12} className="mr-1" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div 
                      className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${
                        message.sender.includes('clarityhub.com') ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span>{message.sender}</span>
                      <span className="mx-1">•</span>
                      <span>{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex space-x-2">
                <textarea 
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-grow rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 h-20"
                ></textarea>
                <div className="flex flex-col justify-between">
                  <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70">
                    <Paperclip size={20} />
                  </button>
                  <button 
                    className="p-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    disabled={!replyText.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Ticket ID</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</th>
                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Assignee</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <AnimatePresence>
                    {paginatedTickets.length > 0 ? (
                      <>
                        {paginatedTickets.map((ticket, index) => (
                          <motion.tr 
                            key={ticket.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                              {ticket.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900 dark:text-white">{ticket.subject}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ticket.category}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                              {ticket.user}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(ticket.status)}`}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeStyles(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-700 dark:text-slate-300">{ticket.time}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ticket.date}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                              {ticket.assignee || (
                                <span className="text-amber-500 dark:text-amber-400">Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                View
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                          <div>
                            <p className="font-medium mb-1">No tickets found</p>
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
            {filteredTickets.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}