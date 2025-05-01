"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  GanttChartSquare,
  Receipt,
  Wallet,
  CheckCheck,
  Download,
  Edit,
  CheckCircle2,
  Tag,
  PlusCircle
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

// Helper for status badge styling
const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'pending':
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'failed':
    case 'canceled':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    case 'used':
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400';
  }
};

// Card brand icon component
const CardBrandIcon = ({ brand }: { brand: string }) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return <div className="text-blue-600 font-semibold text-xs">VISA</div>;
    case 'mastercard':
      return <div className="text-orange-600 font-semibold text-xs">MASTERCARD</div>;
    default:
      return <div className="text-slate-500 font-semibold text-xs">{brand.toUpperCase()}</div>;
  }
};

interface BillingOverviewProps {
  billingStats: Array<{
    title: string;
    value: string;
    status: string;
    icon: any;
  }>;
  currentSubscription: {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    renewalDate: string;
    interval: string;
    price: string;
    features: string[];
    seats: number;
    seatsUsed: number;
    addOnFeatures: Array<{ name: string; price: string }>;
  };
  invoiceHistory: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    paymentMethod: string;
    billingPeriod: string;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    brand?: string;
    last4: string;
    expMonth?: number;
    expYear?: number;
    bank_name?: string;
    isDefault: boolean;
    billingAddress: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }>;
  onChangeTab: (tab: 'overview' | 'subscriptions' | 'invoices' | 'payment-methods' | 'settings') => void;
}

export default function BillingOverview({
  billingStats,
  currentSubscription,
  invoiceHistory,
  paymentMethods,
  onChangeTab
}: BillingOverviewProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Current Subscription Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <GanttChartSquare className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
            Current Subscription
          </h2>
          <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            Change Plan
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan details */}
          <div className="col-span-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Plan</p>
                <div className="flex items-center mt-1">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{currentSubscription.plan}</p>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    {currentSubscription.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Billing Period</p>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {currentSubscription.interval} • {currentSubscription.price}/year
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Started On</p>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {currentSubscription.startDate}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Next Renewal</p>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {currentSubscription.renewalDate}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">User Seats</p>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{currentSubscription.seatsUsed} out of {currentSubscription.seats} seats used</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{Math.round((currentSubscription.seatsUsed/currentSubscription.seats) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(currentSubscription.seatsUsed/currentSubscription.seats) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="col-span-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Included Features</p>
            <ul className="space-y-2">
              {currentSubscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Add-ons */}
          <div className="col-span-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Add-on Features</p>
            <ul className="space-y-3">
              {currentSubscription.addOnFeatures.map((addon, index) => (
                <li key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{addon.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{addon.price}</span>
                </li>
              ))}
              <button className="w-full flex items-center justify-center px-4 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add new feature
              </button>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recent Invoices */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Recent Invoices
          </h2>
          <button 
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            onClick={() => onChangeTab('invoices')}
          >
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {invoiceHistory.slice(0, 3).map((invoice, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{invoice.id}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{invoice.billingPeriod}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(invoice.status)}`}>
                      {invoice.status === 'Paid' && <CheckCheck size={12} className="mr-1" />}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-sm px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      View
                    </button>
                    <button className="text-sm px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Payment Methods Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
            Payment Methods
          </h2>
          <button 
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            onClick={() => onChangeTab('payment-methods')}
          >
            Manage
          </button>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.slice(0, 2).map((method, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${method.isDefault ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {method.type === 'card' ? (
                    <>
                      <div className="w-10 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-3">
                        <CardBrandIcon brand={method.brand || ''} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-3">
                        <div className="text-slate-700 dark:text-slate-300 text-xs">BANK</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {method.bank_name} •••• {method.last4}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          ACH Direct Debit
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {method.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}