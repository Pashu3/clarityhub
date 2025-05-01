"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation"; // Ensure this path is correct

interface MobileSidebarProps {
  id?: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ id }) => {
  const pathname = usePathname();

  return (
    <div 
      id={id}
      className="fixed inset-0 z-50 flex md:hidden"
    >
      {/* Backdrop/overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Sidebar panel */}
      <div className="relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-gray-900 overflow-y-auto shadow-xl">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <span className="font-bold">C</span>
            </div>
            <span className="ml-3 font-bold text-gray-900 dark:text-white">ClarityHub</span>
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md",
                      isActive 
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};