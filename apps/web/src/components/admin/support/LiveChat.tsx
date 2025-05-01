"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquareDashed, 
  CheckCircle2
} from "lucide-react";

interface LiveChatProps {}

export default function LiveChat({}: LiveChatProps) {
  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
        <MessageSquareDashed className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
        Live Chat Management
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Configure and monitor live chat support for your customers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="p-5 rounded-lg border border-slate-100 dark:border-slate-700 bg-green-50 dark:bg-green-900/10">
          <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
            Live Chat Status
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Currently online and available</p>
          <button className="mt-3 text-sm px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
            Set Offline
          </button>
        </div>
        
        <div className="p-5 rounded-lg border border-slate-100 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white">Active Chats</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">3</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">2 agents online</p>
        </div>
        
        <div className="p-5 rounded-lg border border-slate-100 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white">Queue</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">1</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Average wait: 2 minutes</p>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700 mb-6">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <h3 className="font-medium text-slate-900 dark:text-white">Active Chat Sessions</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Visitor</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Agent</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Page</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                visitor_8493 (United States)
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                james.wilson@clarityhub.com
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                12 minutes
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                /pricing
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Join
                </button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                visitor_8492 (Canada)
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                michael.brown@clarityhub.com
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                7 minutes
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                /features
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Join
                </button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                visitor_8491 (Germany)
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                admin@clarityhub.com
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                3 minutes
              </td>
              <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                /integrations
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Join
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <h3 className="font-medium text-slate-900 dark:text-white">Canned Responses</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm">Welcome Message</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Hello! Thank you for contacting ClarityHub support. How can I assist you today?
              </p>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm">Pricing Question</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                We offer several pricing tiers designed to fit businesses of all sizes. You can find detailed information on our pricing page.
              </p>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm">Technical Issue</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                I'm sorry you're experiencing an issue. Could you please provide more details so I can better assist you?
              </p>
            </div>
            
            <button className="w-full px-4 py-2 mt-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              Manage Canned Responses
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <h3 className="font-medium text-slate-900 dark:text-white">Chat Analytics</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Satisfaction Rate</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">92%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Response Time</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">45 seconds</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chat Duration</span>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">7.5 minutes</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <button className="w-full px-4 py-2 mt-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}