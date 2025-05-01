"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Sparkles,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// Temporary mock data for development
const recentUploads = [
  { id: 1, name: "sales_q1_2025.csv", date: "2025-04-20", size: 1024 * 1024 * 2.3, status: "success" },
  { id: 2, name: "customer_feedback.csv", date: "2025-04-18", size: 1024 * 512, status: "success" },
  { id: 3, name: "inventory_march.csv", date: "2025-04-15", size: 1024 * 1024 * 1.1, status: "success" },
];

const insights = [
  "Revenue increased by 23% compared to previous quarter",
  "Customer satisfaction ratings up by 8 points",
  "Top selling product: Ultra Widget X3000",
  "New customer acquisition cost decreased by 15%"
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  
  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Analyze your data and get AI-powered insights
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            as={Link}
            href="/dashboard/uploads/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Upload size={18} />
            <span>Upload New CSV</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div 
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { 
            title: "Total Files", 
            value: "17", 
            icon: FileSpreadsheet, 
            color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200" 
          },
          { 
            title: "Analyses Run", 
            value: "43", 
            icon: Sparkles, 
            color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200" 
          },
          { 
            title: "Charts Created", 
            value: "12", 
            icon: BarChart3, 
            color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200" 
          },
          { 
            title: "Team Members", 
            value: "5", 
            icon: Users, 
            color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-200" 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full p-2 ${stat.color} shadow-inner`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent uploads and AI insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent uploads */}
        <motion.div 
          variants={item} 
          className="rounded-lg shadow-lg bg-white dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Recent Uploads
            </h2>
            <Link 
              href="/dashboard/uploads" 
              className="text-sm flex items-center hover:underline text-blue-600 dark:text-blue-400"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-6 pt-0">
            {recentUploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <FileSpreadsheet className="h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">No uploads yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-4 shadow hover:shadow-md border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  as={Link}
                  href="/dashboard/uploads/new"
                >
                  Upload your first CSV
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentUploads.map((file) => (
                  <li key={file.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(file.date).toLocaleDateString()} • {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        as={Link}
                        href={`/dashboard/explorer?file=${file.id}`}
                        className="hover:shadow-md transition-shadow text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        Explore
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div 
          variants={item} 
          className="rounded-lg shadow-lg bg-white dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              AI Insights
            </h2>
            <Link 
              href="/dashboard/chat" 
              className="text-sm flex items-center hover:underline text-blue-600 dark:text-blue-400"
            >
              Chat with AI <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-6 pt-0">
            {insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Sparkles className="h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">No insights generated yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-4 shadow hover:shadow-md border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  as={Link}
                  href="/dashboard/chat"
                >
                  Ask AI for insights
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start rounded-md p-3 shadow-sm hover:shadow-md transition-shadow bg-blue-50 dark:bg-blue-900/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <TrendingUp className="h-5 w-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {insight}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick action cards */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        {[
          { 
            title: "Analyze Data", 
            description: "Ask questions and get insights from your CSV data",
            icon: Sparkles, 
            href: "/dashboard/chat",
            color: "from-blue-500 to-indigo-600",
            iconColor: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-50 dark:bg-blue-900/20"
          },
          { 
            title: "Visualize Trends", 
            description: "Create beautiful charts from your spreadsheets",
            icon: BarChart3, 
            href: "/dashboard/charts",
            color: "from-amber-500 to-orange-600",
            iconColor: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-50 dark:bg-amber-900/20"
          },
          { 
            title: "Upload New File", 
            description: "Add a new CSV file to analyze and visualize",
            icon: Upload, 
            href: "/dashboard/uploads/new",
            color: "from-green-500 to-emerald-600",
            iconColor: "text-green-600 dark:text-green-400",
            iconBg: "bg-green-50 dark:bg-green-900/20"
          }
        ].map((action) => (
          <motion.div
            key={action.title}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className={`mb-4 rounded-full ${action.iconBg} p-2 w-fit shadow-sm`}>
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
              <Button
                variant="ghost"
                className={`mt-4 px-0 hover:bg-transparent hover:shadow-sm transition-shadow ${action.iconColor} hover:text-blue-700 dark:hover:text-blue-300`}
                as={Link}
                href={action.href}
              >
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 transition-opacity group-hover:opacity-5`} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}