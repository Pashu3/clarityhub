"use client";

import { motion } from "framer-motion";
import { HowItWorksStep } from "./types";

const steps: HowItWorksStep[] = [
  {
    number: "01",
    title: "Connect your data sources",
    description: "Easily connect your existing data sources with our pre-built integrations."
  },
  {
    number: "02",
    title: "Customize your dashboard",
    description: "Drag and drop widgets to create custom dashboards that show the metrics that matter to you."
  },
  {
    number: "03",
    title: "Gain actionable insights",
    description: "Analyze trends, identify opportunities, and make data-driven decisions."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">How It Works</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Get started in three simple steps
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            From setup to insights in minutes, not days.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-100 dark:bg-slate-800"></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 dark:bg-blue-500 text-white text-xl font-bold h-16 w-16 rounded-full flex items-center justify-center relative z-10 mb-4">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {step.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}