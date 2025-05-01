"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  GanttChartSquare,
  Tag,
  PlusCircle,
  BadgePercent,
  CheckCircle2,
  CheckCheck,
  Info
} from "lucide-react";

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

interface SubscriptionProps {
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
  couponCodes: Array<{
    id: string;
    code: string;
    discount: string;
    status: string;
    validUntil: string;
    usage: string;
    appliedTo: string;
  }>;
  availablePlans: Array<{
    id: string;
    name: string;
    price: string;
    interval: string;
    features: string[];
    highlighted: boolean;
  }>;
  onShowCouponModal: () => void;
  onShowSubscriptionModal: () => void;
}

export default function Subscription({
  currentSubscription,
  couponCodes,
  availablePlans,
  onShowCouponModal,
  onShowSubscriptionModal
}: SubscriptionProps) {
  return (
    <motion.div
      key="subscriptions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Current Plan */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <GanttChartSquare className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
            Current Plan
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            Active
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{currentSubscription.plan}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentSubscription.interval} billing • {currentSubscription.price}/year
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Billing Period</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {currentSubscription.startDate} - {currentSubscription.renewalDate}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Next Renewal</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {currentSubscription.renewalDate}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">User Seats</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {currentSubscription.seatsUsed}/{currentSubscription.seats} used
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(currentSubscription.seatsUsed/currentSubscription.seats) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Auto-Renewal</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <button 
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
                onClick={onShowSubscriptionModal}
              >
                Change Plan
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                Add Seats
              </button>
              <button className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                Cancel Subscription
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Included Features</h3>
            <ul className="space-y-3">
              {currentSubscription.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add-Ons */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Tag className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
            Add-On Features
          </h2>
          <button className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <PlusCircle className="h-4 w-4 mr-1 inline-block" />
            Add Feature
          </button>
        </div>
        
        <div className="space-y-4">
          {currentSubscription.addOnFeatures.map((addon, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">{addon.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Added to your subscription
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900 dark:text-white">{addon.price}</p>
                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-1">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Available Coupon Codes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <BadgePercent className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
            Available Discounts
          </h2>
          <button 
            className="text-sm px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
            onClick={onShowCouponModal}
          >
            Apply Coupon
          </button>
        </div>
        
        <div className="space-y-4">
          {couponCodes.map((coupon, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-slate-900 dark:text-white">{coupon.code}</h3>
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(coupon.status)}`}>
                    {coupon.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {coupon.discount} off • Valid until {coupon.validUntil}
                </p>
              </div>
              <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                {coupon.status === 'Active' ? 'Applied to ' + coupon.appliedTo : 'Used on ' + coupon.appliedTo}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Plan Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <GanttChartSquare className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
            Available Plans
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare different plans and choose the one that fits your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl border ${
                plan.highlighted 
                  ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10' 
                  : 'border-slate-200 dark:border-slate-700'
              } p-5 flex flex-col`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-end mt-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/{plan.interval}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                {plan.highlighted ? (
                  <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white font-medium">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Current Plan
                  </div>
                ) : (
                  <button className="w-full px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Switch to {plan.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}