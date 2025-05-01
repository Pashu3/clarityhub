"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FileQuestion, 
  CheckCircle2, 
  Mail, 
  MessageSquareDashed, 
  Phone,
  Clock
} from "lucide-react";

// Animation variants
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

interface SupportOverviewProps {
  supportTickets: any[];
  knowledgeArticles: any[];
  setActiveTab: (tab: 'overview' | 'tickets' | 'chat' | 'knowledge' | 'settings') => void;
}

export default function SupportOverview({ 
  supportTickets, 
  knowledgeArticles, 
  setActiveTab 
}: SupportOverviewProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Recent tickets */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
            Recent Tickets
          </h2>
          <button 
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            onClick={() => setActiveTab('tickets')}
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {supportTickets.slice(0, 3).map((ticket, index) => (
            <motion.div 
              key={ticket.id}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-700"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">{ticket.subject}</h3>
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{ticket.id}</span>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${ticket.priority === 'High' ? 'red' : ticket.priority === 'Medium' ? 'amber' : 'blue'}-100 dark:bg-${ticket.priority === 'High' ? 'red' : ticket.priority === 'Medium' ? 'amber' : 'blue'}-900/30 text-${ticket.priority === 'High' ? 'red' : ticket.priority === 'Medium' ? 'amber' : 'blue'}-700 dark:text-${ticket.priority === 'High' ? 'red' : ticket.priority === 'Medium' ? 'amber' : 'blue'}-400`}>
                      {ticket.priority}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${ticket.status === 'Open' ? 'amber' : ticket.status === 'In Progress' ? 'blue' : 'green'}-100 dark:bg-${ticket.status === 'Open' ? 'amber' : ticket.status === 'In Progress' ? 'blue' : 'green'}-900/30 text-${ticket.status === 'Open' ? 'amber' : ticket.status === 'In Progress' ? 'blue' : 'green'}-700 dark:text-${ticket.status === 'Open' ? 'amber' : ticket.status === 'In Progress' ? 'blue' : 'green'}-400`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{ticket.description}</p>
                  <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {ticket.time}
                    <span className="mx-2">•</span>
                    {ticket.user}
                    <span className="mx-2">•</span>
                    {ticket.assignee ? (
                      <span>Assigned to: {ticket.assignee}</span>
                    ) : (
                      <span className="text-amber-500 dark:text-amber-400">Unassigned</span>
                    )}
                  </div>
                </div>
                
                <button className="px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Knowledge Base Articles */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
            Popular Knowledge Base Articles
          </h2>
          <button 
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            onClick={() => setActiveTab('knowledge')}
          >
            View all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeArticles.slice(0, 6).map((article, index) => (
            <motion.div 
              key={article.id}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{article.category}</span>
              <h3 className="font-medium text-slate-900 dark:text-white mt-1">{article.title}</h3>
              <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {article.views.toLocaleString()} views
                </span>
                <span className="mx-2">•</span>
                <span>
                  Updated: {article.lastUpdated}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Contact Channels */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Support Channels
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex">
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-lg mr-4">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Email Support</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@clarityhub.com</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Average response: 4 hours</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg mr-4">
              <MessageSquareDashed className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Live Chat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Available on business days</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">9 AM - 6 PM EST</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mr-4">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Phone Support</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">+1 (555) 123-4567</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Premium accounts only</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}