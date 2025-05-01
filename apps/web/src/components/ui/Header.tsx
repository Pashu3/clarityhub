"use client";

import { motion } from "framer-motion";
import { Bell, User, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center space-x-4">
        <div className="hidden md:block relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-md border bg-background pl-8 h-9 w-64 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full p-2 hover:bg-muted"
        >
          <Bell size={18} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full p-1 hover:bg-muted"
        >
          <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <User size={16} />
          </div>
        </motion.button>
      </div>
    </header>
  );
}