"use client";

import React from "react";
import { 
  Users, 
  Database, 
  CreditCard, 
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/dashboard/StatCard";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import SecurityAlerts from "@/components/admin/dashboard/SecurityAlerts";
import PendingTasks from "@/components/admin/dashboard/PendingTasks";
import SystemHealth from "@/components/admin/dashboard/SystemHealth";

export default function AdminDashboardPage() {
  // Sample data for demo purposes
  const stats = [
    { 
      name: "Total Users", 
      value: "2,451", 
      change: "+12%", 
      trend: "up", 
      icon: Users,
      href: "/admin/users"
    },
    { 
      name: "Active Subscriptions", 
      value: "721", 
      change: "+5%", 
      trend: "up", 
      icon: CreditCard,
      href: "/admin/billing"
    },
    { 
      name: "Data Storage", 
      value: "1.4 TB", 
      change: "+22%", 
      trend: "up", 
      icon: Database,
      href: "/admin/data"
    },
    { 
      name: "Support Tickets", 
      value: "18", 
      change: "-7%", 
      trend: "down", 
      icon: HelpCircle,
      href: "/admin/support"
    },
  ];

  const recentActivities = [
    { id: 1, user: "John Smith", action: "Updated profile", time: "2 minutes ago" },
    { id: 2, user: "Sarah Johnson", action: "Purchased Premium plan", time: "15 minutes ago" },
    { id: 3, user: "Michael Brown", action: "Uploaded new dataset", time: "43 minutes ago" },
    { id: 4, user: "Emma Wilson", action: "Created support ticket", time: "1 hour ago" },
    { id: 5, user: "David Lee", action: "Changed password", time: "2 hours ago" },
  ];

  const securityAlerts = [
    { id: 1, level: "high", message: "Multiple failed login attempts for admin@example.com", time: "30 minutes ago" },
    { id: 2, level: "medium", message: "New admin user created by superadmin", time: "2 hours ago" },
    { id: 3, level: "low", message: "API rate limit reached for analytics endpoint", time: "3 hours ago" },
  ];

  const pendingTasks = [
    { id: 1, name: "Review and approve new content", priority: "high", due: "Today" },
    { id: 2, name: "Respond to urgent support tickets", priority: "high", due: "Today" },
    { id: 3, name: "Generate monthly billing reports", priority: "medium", due: "Tomorrow" },
    { id: 4, name: "Update system documentation", priority: "low", due: "Next week" },
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleString()}
        </span>
      </motion.div>

      {/* Key Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <StatCard 
            key={stat.name}
            name={stat.name}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            href={stat.href}
            index={index}
          />
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Recent Activity */}
        <div className="col-span-1 lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Security Alerts & Pending Tasks */}
        <motion.div 
          className="space-y-6"
          variants={container}
        >
          {/* Security Alerts */}
          <SecurityAlerts alerts={securityAlerts} />

          {/* Pending Tasks */}
          <PendingTasks tasks={pendingTasks} />
        </motion.div>
      </motion.div>

      {/* System Health */}
      <SystemHealth />
    </motion.div>
  );
}