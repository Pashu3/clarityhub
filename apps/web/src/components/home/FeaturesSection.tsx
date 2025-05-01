"use client";

import { motion } from "framer-motion";
import { BarChart3, Database, Layout, Shield, Users, Zap } from "lucide-react";
import { Feature } from "./types";

const features: Feature[] = [
  {
    title: "Intuitive Dashboard",
    description: "Monitor your key metrics at a glance with our customizable dashboard.",
    icon: <Layout className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Advanced Analytics",
    description: "Gain deeper insights with our advanced analytics capabilities.",
    icon: <BarChart3 className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Team Collaboration",
    description: "Seamlessly collaborate with your team in real-time.",
    icon: <Users className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Data Security",
    description: "Enterprise-grade security to keep your data safe and compliant.",
    icon: <Shield className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Real-time Processing",
    description: "Process and visualize your data as it comes in without delays.",
    icon: <Zap className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Data Integration",
    description: "Connect to your existing data sources with our flexible integrations.",
    icon: <Database className="h-10 w-10 text-blue-500" />
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Features</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to manage your data
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Our comprehensive suite of tools helps you work smarter, not harder.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 dark:bg-slate-900 p-8 rounded-xl hover:shadow-xl transition-all border border-gray-100 dark:border-slate-800"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}