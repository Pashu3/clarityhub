"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight,
  ArrowLeftToLine,
  LogOut,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { adminNavigationItems } from "@/config/admin-navigation";

// Export drawer widths as constants (using Tailwind classes)
export const ADMIN_DRAWER_COLLAPSED_WIDTH = "w-20"; // 5rem (80px)
export const ADMIN_DRAWER_EXPANDED_WIDTH = "w-64"; // 16rem (256px)

interface AdminNavigationDrawerProps {
  onExpandChange?: (expanded: boolean) => void;
  initialExpanded?: boolean;
  className?: string;
}

export function AdminNavigationDrawer({ 
  onExpandChange, 
  initialExpanded = true,
  className
}: AdminNavigationDrawerProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(initialExpanded);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const initializedRef = useRef(false);
  
  // Initial setup only once
  useEffect(() => {
    if (initializedRef.current) return;
    
    initializedRef.current = true;
    setExpanded(initialExpanded);
    onExpandChange?.(initialExpanded);
  }, [initialExpanded, onExpandChange]);
  
  // Sync with parent component when props change
  useEffect(() => {
    if (!initializedRef.current) return;
    
    setExpanded(initialExpanded);
  }, [initialExpanded]);
  
  const toggleDrawer = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    // Notify parent component
    if (onExpandChange) {
      onExpandChange(newExpanded);
    }
  };

  return (
    <div 
      ref={drawerRef}
      className={cn(
        "fixed left-0 top-0 z-10 h-screen overflow-hidden shadow-sm",
        "bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800",
        "transition-all duration-300",
        expanded ? "w-64" : "w-20",
        className
      )}
    >
      {/* Logo and Expanded Toggle */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="h-5 w-5" />
          </motion.div>
          
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-bold text-lg whitespace-nowrap overflow-hidden text-slate-900 dark:text-white"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="rounded-full p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeftToLine size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation Items */}
      <div className="h-[calc(100vh-128px)] overflow-y-auto overflow-x-hidden">
        <ul className="mt-6 space-y-1.5 px-3">
          {adminNavigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <motion.li
                key={item.name}
                whileHover={{ x: expanded ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-4 py-3 text-base font-medium transition-all duration-150",
                    isActive 
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon className={cn(
                    "h-6 w-6 transition-transform", 
                    expanded ? "mr-4" : "mx-auto",
                    isActive 
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-slate-500 dark:text-slate-400",
                    "group-hover:scale-110"
                  )} />
                  
                  <AnimatePresence mode="wait">
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                
                {expanded && item.description && isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs ml-12 mt-0.5 pl-1 text-slate-500 dark:text-slate-400"
                  >
                    {item.description}
                  </motion.p>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
      
      {/* Expand button and footer */}
      <div className="absolute bottom-0 left-0 w-full p-3 pt-8">
        {!expanded && (
          <motion.button
            onClick={toggleDrawer}
            className="flex w-full items-center justify-center rounded-md py-2.5 transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
        
        <Link
          href="/menu/dashboard"
          className="flex items-center rounded-md px-3 py-3 text-sm transition-colors cursor-pointer mt-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <LogOut className={cn(
            "h-5 w-5 transition-transform",
            expanded ? "mr-3" : "mx-auto"
          )} />
          
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                Exit Admin
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  );
}