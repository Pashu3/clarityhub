"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { PricingPlan } from "./types";

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Perfect for small teams starting their data journey",
    features: [
      "Up to 5 team members",
      "Basic analytics dashboard",
      "1GB data storage",
      "Standard support",
      "Core integrations"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$79",
    period: "per month",
    description: "Advanced features for growing businesses",
    features: [
      "Up to 20 team members",
      "Advanced analytics & reporting",
      "10GB data storage",
      "Priority support",
      "All integrations",
      "Custom dashboards"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited team members",
      "Enterprise analytics suite",
      "Unlimited storage",
      "Dedicated support team",
      "Custom integrations",
      "Advanced security features",
      "On-premise deployment options"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Pricing</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that works best for your team
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index} 
              className={`rounded-2xl overflow-hidden transition-all ${
                plan.popular 
                  ? "border-2 border-blue-500 dark:border-blue-500 scale-105 shadow-xl"
                  : "border border-gray-200 dark:border-slate-800 shadow-lg"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white py-2 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="bg-white dark:bg-slate-950 p-8">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
                
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link 
                    href="/auth/register" 
                    className={`block w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                      plan.popular 
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}