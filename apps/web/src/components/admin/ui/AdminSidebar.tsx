"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavigationItems } from "@/config/admin-navigation"; 

interface AdminMobileSidebarProps {
  id?: string;
}

export const AdminMobileSidebar: React.FC<AdminMobileSidebarProps> = ({ id }) => {
  const pathname = usePathname();

  return (
    <div 
      id={id}
      className="fixed inset-0 z-50 flex md:hidden"
    >
      {/* Backdrop/overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Sidebar panel */}
      <div className="relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-slate-900 overflow-y-auto shadow-xl">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="ml-3 font-bold text-slate-900 dark:text-white">Admin Panel</span>
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {adminNavigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md",
                      isActive 
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Exit Admin link */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/menu/dashboard"
            className="flex items-center px-3 py-3 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
            <span>Exit Admin Panel</span>
          </Link>
        </div>
      </div>
    </div>
  );
};