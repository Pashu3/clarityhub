"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LineChart, PieChart, Star } from "lucide-react";
import Navigation from "./Navigation";

export default function HeroSection() {
  return (
    <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>
      
      <Navigation />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-24 md:pb-32 flex flex-col md:flex-row items-center">
        <motion.div 
          className="md:w-1/2 mb-12 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Transform Your Data <br className="hidden md:block" />
            <span className="text-blue-300">Into Insights</span>
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-lg">
            ClarityHub helps teams analyze, visualize, and derive insights from their data with an intuitive and powerful platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/auth/register" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-colors text-center"
            >
              Start Free Trial
            </Link>
            <a 
              href="#features" 
              className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-lg font-medium transition-colors border border-white/20 backdrop-blur-sm text-center"
            >
              Learn More
            </a>
          </div>
          
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-900 flex items-center justify-center text-white text-xs font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-blue-200">From 2,000+ reviews</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold text-white">Dashboard Overview</div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-blue-200">Total Revenue</div>
                  <div className="text-xl font-bold text-white">$54,350.28</div>
                  <div className="text-sm text-green-400 flex items-center mt-1">
                    <ArrowRight size={12} className="transform rotate-45" />
                    <span className="ml-1">+12.5%</span>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-blue-200">Active Users</div>
                  <div className="text-xl font-bold text-white">2,845</div>
                  <div className="text-sm text-green-400 flex items-center mt-1">
                    <ArrowRight size={12} className="transform rotate-45" />
                    <span className="ml-1">+8.2%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg mb-6">
                <div className="h-40 flex items-end justify-around">
                  {[35, 55, 42, 78, 65, 80, 45].map((height, i) => (
                    <div key={i} className="w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-200">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex-1 flex items-center justify-center">
                  <LineChart size={16} className="mr-2" />
                  View Analytics
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex-1 flex items-center justify-center">
                  <PieChart size={16} className="mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
          
          {/* Abstract decoration */}
          <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-xl opacity-50"></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 blur-xl opacity-50"></div>
        </motion.div>
      </div>
    </header>
  );
}