"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Calendar, 
  Download, 
  DollarSign, 
  BarChart, 
  Users, 
  Settings, 
  PlusCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  BadgePercent,
  Receipt,
  CreditCardIcon,
  Landmark,
  X,
  Info,
  GanttChartSquare,
  Wallet,
  Search,
  ChevronDown
} from "lucide-react";

// Import the separated components
import BillingOverview from "@/components/admin/billing/BillingOverview";
import Subscription from "@/components/admin/billing/Subscription";
import Invoices from "@/components/admin/billing/Invoices";
import PaymentMethods from "@/components/admin/billing/PaymentMethods";
import BillingSettings from "@/components/admin/billing/BillingSettings";

export default function AdminBillingPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'invoices' | 'payment-methods' | 'settings'>('overview');

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Current subscription
  const currentSubscription = {
    id: "sub_12345",
    plan: "Enterprise",
    status: "Active",
    startDate: "Jan 15, 2025",
    renewalDate: "Jan 15, 2026",
    interval: "Annual",
    price: "$9,999.00",
    features: [
      "Unlimited users",
      "24/7 priority support",
      "Custom integrations",
      "Advanced analytics",
      "White labeling",
      "API access",
      "Dedicated account manager"
    ],
    seats: 150,
    seatsUsed: 132,
    addOnFeatures: [
      { name: "Premium Support", price: "$999/year" },
      { name: "Advanced Security", price: "$1,999/year" }
    ]
  };
  
  // Billing overview stats
  const billingStats = [
    { 
      title: "Current Plan", 
      value: "Enterprise",
      status: "Active",
      icon: GanttChartSquare
    },
    { 
      title: "Next Invoice", 
      value: "$9,999.00",
      status: "Due Jan 15, 2026",
      icon: Receipt
    },
    { 
      title: "Billing Cycle", 
      value: "Annual",
      status: "Save 20%",
      icon: Calendar
    },
    { 
      title: "Seats", 
      value: "132/150",
      status: "88% utilized",
      icon: Users
    },
  ];

  // Invoice history
  const invoiceHistory = [
    { 
      id: "INV-2025-001", 
      date: "Jan 15, 2025",
      amount: "$9,999.00",
      status: "Paid",
      paymentMethod: "Visa ending in 4242",
      billingPeriod: "Jan 15, 2025 - Jan 14, 2026"
    },
    { 
      id: "INV-2024-012", 
      date: "Dec 05, 2024",
      amount: "$299.00",
      status: "Paid",
      paymentMethod: "Visa ending in 4242",
      billingPeriod: "One-time purchase: Additional seats (5)"
    },
    { 
      id: "INV-2024-006", 
      date: "Jun 22, 2024",
      amount: "$1,999.00",
      status: "Paid",
      paymentMethod: "Visa ending in 4242",
      billingPeriod: "One-time purchase: Advanced Security add-on"
    },
    { 
      id: "INV-2024-001", 
      date: "Jan 15, 2024",
      amount: "$7,999.00",
      status: "Paid",
      paymentMethod: "Mastercard ending in 5555",
      billingPeriod: "Jan 15, 2024 - Jan 14, 2025"
    },
    { 
      id: "INV-2023-008", 
      date: "Aug 10, 2023",
      amount: "$499.00",
      status: "Paid",
      paymentMethod: "Mastercard ending in 5555",
      billingPeriod: "One-time purchase: Data migration service"
    },
    { 
      id: "INV-2023-001", 
      date: "Jan 15, 2023",
      amount: "$5,999.00",
      status: "Paid",
      paymentMethod: "Mastercard ending in 5555",
      billingPeriod: "Jan 15, 2023 - Jan 14, 2024"
    },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: "pm_123456",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2028,
      isDefault: true,
      billingAddress: {
        line1: "123 Corporate Drive",
        city: "San Francisco",
        state: "CA",
        postal_code: "94107",
        country: "US"
      }
    },
    {
      id: "pm_654321",
      type: "card",
      brand: "Mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2026,
      isDefault: false,
      billingAddress: {
        line1: "123 Corporate Drive",
        city: "San Francisco",
        state: "CA",
        postal_code: "94107",
        country: "US"
      }
    },
    {
      id: "pm_789012",
      type: "ach_debit",
      bank_name: "Chase",
      last4: "7890",
      isDefault: false,
      billingAddress: {
        line1: "123 Corporate Drive",
        city: "San Francisco",
        state: "CA",
        postal_code: "94107",
        country: "US"
      }
    }
  ];

  // Coupon codes
  const couponCodes = [
    {
      id: "cpn_001",
      code: "LOYALTYDISCOUNT25",
      discount: "25%",
      status: "Active",
      validUntil: "Dec 31, 2025",
      usage: "Once",
      appliedTo: "Next renewal"
    },
    {
      id: "cpn_002",
      code: "ADDON50OFF",
      discount: "50%",
      status: "Used",
      validUntil: "Jun 30, 2024",
      usage: "Once",
      appliedTo: "Add-on: Advanced Security"
    }
  ];

  // Subscription plan options
  const availablePlans = [
    {
      id: "plan_starter",
      name: "Starter",
      price: "$199",
      interval: "monthly",
      features: [
        "Up to 10 users",
        "Basic support",
        "Core features",
        "1GB storage",
        "Standard reporting"
      ],
      highlighted: false
    },
    {
      id: "plan_business",
      name: "Business",
      price: "$999",
      interval: "monthly",
      features: [
        "Up to 50 users",
        "Priority support",
        "Advanced features",
        "25GB storage",
        "Advanced reporting",
        "API access"
      ],
      highlighted: false
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      price: "$9,999",
      interval: "annual",
      features: [
        "Unlimited users",
        "24/7 priority support",
        "All features",
        "Unlimited storage",
        "Custom reporting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "White labeling"
      ],
      highlighted: true
    }
  ];

  // Filter invoices based on search and filters
  const filteredInvoices = invoiceHistory.filter(invoice => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === "" || 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.amount.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === null || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Items per page
  const itemsPerPage = 5;

  // Get paginated items
  const getPaginatedItems = () => {
    let filteredItems: any[] = [];
    
    if (activeTab === 'invoices') {
      filteredItems = filteredInvoices;
    } else if (activeTab === 'payment-methods') {
      filteredItems = paymentMethods;
    } else {
      filteredItems = filteredInvoices;
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

  // Get status badge styling
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

  // Card brand icon component
  const CardBrandIcon = ({ brand }: { brand: string }) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return <div className="text-blue-600 font-semibold text-xs">VISA</div>;
      case 'mastercard':
        return <div className="text-orange-600 font-semibold text-xs">MASTERCARD</div>;
      case 'amex':
        return <div className="text-blue-500 font-semibold text-xs">AMEX</div>;
      case 'discover':
        return <div className="text-orange-500 font-semibold text-xs">DISCOVER</div>;
      default:
        return <CreditCard size={16} className="text-slate-500" />;
    }
  };

  // Bank icon component
  const BankIcon = () => (
    <Landmark size={16} className="text-slate-700 dark:text-slate-300" />
  );

  // Reset current page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

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
          <CreditCard className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          Billing & Subscriptions
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center"
            onClick={() => setShowCouponModal(true)}
          >
            <BadgePercent className="mr-2 h-4 w-4" />
            Apply Coupon
          </button>
          
          <button className="p-2 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <RefreshCw size={18} />
          </button>
        </motion.div>
      </div>
      
      {/* Billing Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {billingStats.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {stat.status}
              </span>
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
          <BarChart className="mr-2 h-4 w-4" />
          Overview
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'subscriptions' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('subscriptions')}
          variants={tabVariants}
          animate={activeTab === 'subscriptions' ? 'active' : 'inactive'}
        >
          <GanttChartSquare className="mr-2 h-4 w-4" />
          Subscription
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'invoices' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('invoices')}
          variants={tabVariants}
          animate={activeTab === 'invoices' ? 'active' : 'inactive'}
        >
          <Receipt className="mr-2 h-4 w-4" />
          Invoices
        </motion.button>
        <motion.button
          className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'payment-methods' 
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('payment-methods')}
          variants={tabVariants}
          animate={activeTab === 'payment-methods' ? 'active' : 'inactive'}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Payment Methods
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
          Billing Settings
        </motion.button>
      </motion.div>
      
      {/* Search and filter for invoices tab */}
      {activeTab === 'invoices' && (
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
                  <span>Status</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
              
              <div className="relative">
                <button
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <Calendar size={16} className="mr-2" />
                  <span>Date Range</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
              
              {statusFilter && (
                <button
                  onClick={() => setStatusFilter(null)}
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
                placeholder="Search invoices..."
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
          <BillingOverview 
            billingStats={billingStats}
            currentSubscription={currentSubscription}
            invoiceHistory={invoiceHistory}
            paymentMethods={paymentMethods}
            onChangeTab={setActiveTab}
          />
        )}
        
        {activeTab === 'subscriptions' && (
          <Subscription 
            currentSubscription={currentSubscription}
            couponCodes={couponCodes}
            availablePlans={availablePlans}
            onShowCouponModal={() => setShowCouponModal(true)}
            onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
          />
        )}
        
        {activeTab === 'invoices' && (
          <Invoices 
            paginatedItems={paginatedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredInvoices={filteredInvoices}
            itemsPerPage={itemsPerPage}
          />
        )}
        
        {activeTab === 'payment-methods' && (
          <PaymentMethods 
            paginatedItems={paginatedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredInvoices={filteredInvoices}
            itemsPerPage={itemsPerPage}
          />
        )}
        
        {activeTab === 'settings' && (
          <BillingSettings />
        )}
      </AnimatePresence>
      
      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                <BadgePercent className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                Apply Coupon Code
              </h3>
              <button 
                onClick={() => setShowCouponModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Enter Coupon Code
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase"
                />
              </div>
              
              <div className="text-xs text-slate-500 dark:text-slate-400">
                The discount will be applied to your next billing cycle unless specified otherwise.
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowCouponModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Subscription Change Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                <GanttChartSquare className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                Change Subscription Plan
              </h3>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Choose the plan that works best for your business. You can change plans at any time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availablePlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      plan.highlighted 
                        ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10 ring-2 ring-purple-600 dark:ring-purple-400' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800'
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                      <div className="flex items-end mt-1">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/{plan.interval}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 dark:text-green-400 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-xs text-purple-600 dark:text-purple-400">
                          +{plan.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                    
                    {plan.highlighted ? (
                      <div className="w-full px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium text-center">
                        Current Plan
                      </div>
                    ) : (
                      <button className="w-full px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-sm font-medium">
                        Select
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Changing Plans</p>
                    <p className="mt-1">If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, you'll receive credit towards future invoices.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Confirm Change
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}