"use client";

import React, { useState } from "react";
import { 
  BarChart as BarChartIcon, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Users,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Share2,
  Filter,
  RefreshCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminAnalyticsPage() {
  // Time range filter state
  const [timeRange, setTimeRange] = useState("30days");
  
  // Mock data for charts
  const userActivityData = [
    { date: "2025-03-28", activeUsers: 1240, newUsers: 210 },
    { date: "2025-03-29", activeUsers: 1350, newUsers: 280 },
    { date: "2025-03-30", activeUsers: 1480, newUsers: 250 },
    { date: "2025-03-31", activeUsers: 1520, newUsers: 290 },
    { date: "2025-04-01", activeUsers: 1650, newUsers: 320 },
    { date: "2025-04-02", activeUsers: 1700, newUsers: 230 },
    { date: "2025-04-03", activeUsers: 1890, newUsers: 310 },
    { date: "2025-04-04", activeUsers: 1950, newUsers: 350 },
    { date: "2025-04-05", activeUsers: 1750, newUsers: 270 },
    { date: "2025-04-06", activeUsers: 1650, newUsers: 240 },
    { date: "2025-04-07", activeUsers: 1580, newUsers: 230 },
    { date: "2025-04-08", activeUsers: 1720, newUsers: 260 },
    { date: "2025-04-09", activeUsers: 1850, newUsers: 290 },
    { date: "2025-04-10", activeUsers: 1820, newUsers: 280 },
    { date: "2025-04-11", activeUsers: 1920, newUsers: 310 },
    { date: "2025-04-12", activeUsers: 2050, newUsers: 350 },
    { date: "2025-04-13", activeUsers: 1980, newUsers: 320 },
    { date: "2025-04-14", activeUsers: 1850, newUsers: 290 },
    { date: "2025-04-15", activeUsers: 1920, newUsers: 310 },
    { date: "2025-04-16", activeUsers: 2080, newUsers: 340 },
    { date: "2025-04-17", activeUsers: 2190, newUsers: 360 },
    { date: "2025-04-18", activeUsers: 2280, newUsers: 380 },
    { date: "2025-04-19", activeUsers: 2350, newUsers: 400 },
    { date: "2025-04-20", activeUsers: 2420, newUsers: 420 },
    { date: "2025-04-21", activeUsers: 2310, newUsers: 380 },
    { date: "2025-04-22", activeUsers: 2290, newUsers: 370 },
    { date: "2025-04-23", activeUsers: 2350, newUsers: 390 },
    { date: "2025-04-24", activeUsers: 2450, newUsers: 410 },
    { date: "2025-04-25", activeUsers: 2520, newUsers: 430 },
    { date: "2025-04-26", activeUsers: 2590, newUsers: 450 },
    { date: "2025-04-27", activeUsers: 2650, newUsers: 460 },
  ];
  
  const revenueData = [
    { month: "Jan", revenue: 42000, expenses: 18000 },
    { month: "Feb", revenue: 52000, expenses: 19000 },
    { month: "Mar", revenue: 58000, expenses: 21000 },
    { month: "Apr", revenue: 69000, expenses: 23000 },
    { month: "May", revenue: 84000, expenses: 25000 },
    { month: "Jun", revenue: 110000, expenses: 28000 },
    { month: "Jul", revenue: 125000, expenses: 30000 },
    { month: "Aug", revenue: 132000, expenses: 32000 },
    { month: "Sep", revenue: 128000, expenses: 31000 },
    { month: "Oct", revenue: 140000, expenses: 34000 },
    { month: "Nov", revenue: 152000, expenses: 36000 },
    { month: "Dec", revenue: 170000, expenses: 38000 },
  ];
  
  const channelData = [
    { name: "Direct", value: 35 },
    { name: "Organic Search", value: 25 },
    { name: "Referral", value: 18 },
    { name: "Social", value: 12 },
    { name: "Email", value: 10 },
  ];
  
  const deviceData = [
    { name: "Desktop", value: 52 },
    { name: "Mobile", value: 38 },
    { name: "Tablet", value: 10 },
  ];
  
  const featureUsageData = [
    { name: "Analytics", users: 1850 },
    { name: "Dashboards", users: 2150 },
    { name: "Reports", users: 1650 },
    { name: "Data Import", users: 1250 },
    { name: "Exports", users: 950 },
    { name: "Alerts", users: 750 },
  ];
  
  // Summary metrics
  const summaryMetrics = [
    {
      title: "Total Users",
      value: "2,650",
      change: "+12.4%",
      trend: "up"
    },
    {
      title: "Active Users",
      value: "1,842",
      change: "+8.2%",
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$168.5K",
      change: "+24.5%",
      trend: "up"
    },
    {
      title: "Avg. Session",
      value: "12m 24s",
      change: "-3.1%",
      trend: "down"
    },
  ];
  
  // Colors for charts
  const COLORS = {
    primary: "#8b5cf6", // purple-500
    secondary: "#c4b5fd", // purple-300
    tertiary: "#a855f7", // purple-600
    success: "#10b981", // emerald-500
    danger: "#ef4444", // red-500
    warning: "#f59e0b", // amber-500
    info: "#3b82f6", // blue-500
    light: "#f3f4f6", // gray-100
    dark: "#1f2937", // gray-800
    chart1: "#8b5cf6", // purple-500
    chart2: "#3b82f6", // blue-500
    chart3: "#10b981", // emerald-500
    chart4: "#f59e0b", // amber-500
    chart5: "#ef4444", // red-500
  };
  
  // Colors for pie charts
  const PIE_COLORS = [COLORS.primary, COLORS.info, COLORS.success, COLORS.warning, COLORS.danger];
  
  // Helper function to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <Calendar size={16} className="mr-2" />
              {timeRange === "7days" && "Last 7 days"}
              {timeRange === "30days" && "Last 30 days"}
              {timeRange === "quarter" && "Last Quarter"}
              {timeRange === "year" && "Last Year"}
              <ChevronDown size={16} className="ml-2" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
          
          <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <Download size={18} />
          </button>
          
          <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.title}</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{metric.value}</p>
            <div className="mt-3 flex items-center">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                metric.trend === 'up' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {metric.trend === 'up' 
                  ? <ArrowUpRight size={12} className="mr-1" /> 
                  : <ArrowDownRight size={12} className="mr-1" />
                }
                {metric.change}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">vs prev. period</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* User Activity Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Users size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
              User Activity
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Active and new users over time</p>
          </div>
          
          <div className="flex items-center mt-3 sm:mt-0">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Active Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">New Users</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={userActivityData}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.info} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorActiveUsers)"
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke={COLORS.info}
                fillOpacity={1}
                fill="url(#colorNewUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Two column layout for smaller charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <BarChartIcon size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
                Revenue Overview
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly revenue and expenses</p>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis 
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Feature Usage Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <Activity size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
                Feature Usage
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Most used platform features</p>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={featureUsageData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 70, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => formatNumber(value)}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="users" 
                  name="Active Users" 
                  fill={COLORS.tertiary} 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Two pie charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Source Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <Share2 size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
                Traffic Sources
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">User acquisition channels</p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {channelData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  ></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Device Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <BarChart3 size={18} className="mr-2 text-slate-500 dark:text-slate-400" />
                Device Breakdown
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">User device categories</p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col gap-4 mt-4 lg:mt-0">
              {deviceData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  ></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}