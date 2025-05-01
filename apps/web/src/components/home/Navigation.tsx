"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
            CH
          </div>
          <span className="text-2xl font-bold text-white">ClarityHub</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-blue-100 hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" className="text-blue-100 hover:text-white transition-colors">Pricing</a>
          <Link href="/auth/login" className="text-blue-100 hover:text-white transition-colors">Login</Link>
          <Link 
            href="/auth/register" 
            className="bg-white text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800/90 backdrop-blur-sm mt-2 py-4 px-4 rounded-xl">
          <div className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-blue-100 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-blue-100 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-blue-100 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <Link 
              href="/auth/login" 
              className="text-blue-100 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-white text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}