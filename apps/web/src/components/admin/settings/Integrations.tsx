"use client";
import React from "react";
import { motion } from "framer-motion";
import { PlugZap, Webhook, Check, Plus, Edit, Trash2 } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
  lastSync: string | null;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: string;
  created: string;
}

interface IntegrationsProps {
  integrations: Integration[];
  webhooks: Webhook[];
}

export default function Integrations({ integrations, webhooks }: IntegrationsProps) {
  return (
    <motion.div
      key="integrations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Connected Services */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <PlugZap className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Connected Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div 
              key={integration.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start"
            >
              <div className="h-10 w-10 rounded bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center mr-3 flex-shrink-0">
                <img src={integration.icon} alt={integration.name} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-slate-900 dark:text-white">{integration.name}</h3>
                  {integration.status === 'connected' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      <Check size={12} className="mr-1" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Disconnected
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{integration.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  {integration.status === 'connected' ? (
                    <>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Last synced: {integration.lastSync}
                      </span>
                      <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Webhooks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Webhook className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Webhooks
          </h2>
          <button className="px-3 py-1.5 text-sm rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center">
            <Plus size={14} className="mr-1" />
            Add Webhook
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">URL</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Events</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {webhooks.map((webhook) => (
                <tr key={webhook.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                    {webhook.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-mono truncate max-w-[200px]">
                    {webhook.url}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {event}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {webhook.status === 'active' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {webhook.created}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded">
                      <Edit size={14} />
                    </button>
                    <button className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}