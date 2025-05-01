"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import { NavigationDrawer as Drawer } from "@/components/ui/Drawer";
import { MobileSidebar as Sidebar } from "@/components/ui/Sidebar";

// Define the shape of our context
interface LayoutContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create context with default undefined value
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Hook to use the layout context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within DashboardLayout");
  }
  return context;
};

// Props interface for the layout provider
interface DashboardLayoutProps {
  children: ReactNode;
}

// Main dashboard layout component
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // State for drawer expansion
  const [expanded, setExpanded] = useState(true);
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to track client-side hydration
  const [mounted, setMounted] = useState(false);

  // Handle drawer expansion directly
  const handleExpandChange = (newExpanded: boolean) => {
    console.log("Drawer expansion changed:", newExpanded);
    setExpanded(newExpanded);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // After mounting, mark as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Calculate drawer width based on expanded state
  const drawerWidth = expanded ? '16rem' : '5rem';

  // Handle initial render to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LayoutContext.Provider value={{ 
      expanded, 
      setExpanded: handleExpandChange,
      isSidebarOpen,
      toggleSidebar
    }}>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:block h-full">
          <Drawer 
            className="h-full" 
            initialExpanded={expanded} 
            onExpandChange={handleExpandChange} 
          />
        </div>

        <div 
          className="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300"
          style={{
            marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
              ? drawerWidth
              : 0
          }}
        >
          {/* Navbar - spans width of content area */}
          <Navbar 
            toggleSidebar={toggleSidebar} 
            className="w-full"
          />

          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto px-4 py-6">
            {children}
          </main>
        </div>

        {/* Mobile sidebar - Only render it when needed */}
        {isSidebarOpen && <Sidebar id="sidebar" />}
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;