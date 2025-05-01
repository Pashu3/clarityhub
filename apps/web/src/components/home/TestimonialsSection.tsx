"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "./types";

const testimonials: Testimonial[] = [
  {
    quote: "ClarityHub has transformed how we analyze and utilize our data. The insights we've gained have been invaluable.",
    author: "John Smith",
    title: "CTO at TechCorp",
    avatar: "JS"
  },
  {
    quote: "The ease of use and powerful features make ClarityHub stand out. Our team's productivity has increased dramatically.",
    author: "Sarah Johnson",
    title: "Data Science Lead at DataFlow",
    avatar: "SJ"
  },
  {
    quote: "Implementing ClarityHub was one of the best decisions we made. The ROI has been outstanding.",
    author: "Michael Chen",
    title: "COO at Innovatech",
    avatar: "MC"
  }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Testimonials</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Loved by businesses worldwide
          </h3>
        </div>
        
        <div className="relative">
          {/* Background decorations */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-70"></div>
          
          <div className="relative bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-full text-left p-4 rounded-xl transition-colors ${
                          activeTestimonial === index
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            activeTestimonial === index
                              ? "bg-blue-600"
                              : "bg-gray-400 dark:bg-gray-600"
                          }`}>
                            {testimonial.avatar}
                          </div>
                          <div className="ml-3">
                            <p className={`font-medium ${
                              activeTestimonial === index
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}>
                              {testimonial.author}
                            </p>
                            <p className={
                              activeTestimonial === index
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-gray-500 dark:text-gray-500"
                            }>
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3 flex items-center">
                  <div>
                    <svg className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-8">
                        {testimonials[activeTestimonial].quote}
                      </p>
                      <div className="flex items-center mt-8">
                        <div className={`w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-lg`}>
                          {testimonials[activeTestimonial].avatar}
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {testimonials[activeTestimonial].author}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {testimonials[activeTestimonial].title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}