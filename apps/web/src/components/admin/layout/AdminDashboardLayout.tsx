"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AdminNavbar from "@/components/admin/ui/AdminNavbar";
import { AdminNavigationDrawer as AdminDrawer } from "@/components/admin/ui/AdminDrawer";
import { AdminMobileSidebar as AdminSidebar } from "@/components/admin/ui/AdminSidebar";

// Define the shape of our context
interface AdminLayoutContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create context with default undefined value
const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

// Hook to use the admin layout context
export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminDashboardLayout");
  }
  return context;
};

// Props interface for the layout provider
interface AdminDashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

// Main admin dashboard layout component
const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ 
  children,
  pageTitle = "Admin Dashboard" 
}) => {
  const [expanded, setExpanded] = useState(true);
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to track client-side hydration
  const [mounted, setMounted] = useState(false);

  // Handle drawer expansion directly
  const handleExpandChange = (newExpanded: boolean) => {
    console.log("Admin drawer expansion changed:", newExpanded);
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
      const sidebar = document.getElementById("admin-sidebar");
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

  // Mock admin user data - in a real app, this would come from authentication
  const adminUser = {
    name: "Admin User",
    email: "admin@clarityhub.com",
    avatar: undefined,
    role: "System Administrator"
  };

  // Handle initial render to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AdminLayoutContext.Provider value={{ 
      expanded, 
      setExpanded: handleExpandChange,
      isSidebarOpen,
      toggleSidebar
    }}>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:block h-full">
          <AdminDrawer 
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
          {/* Admin Navbar - spans width of content area */}
          <AdminNavbar 
            toggleSidebar={toggleSidebar}
            pageTitle={pageTitle}
            user={adminUser}
            className="w-full"
          />

          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
          {/* Admin footer */}
          <footer className="py-3 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between items-center">
              <div>
                &copy; {new Date().getFullYear()} ClarityHub Admin Panel
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                  Admin v1.0.0
                </span>
              </div>
            </div>
          </footer>
        </div>

        {/* Mobile admin sidebar - Only render it when needed */}
        {isSidebarOpen && <AdminSidebar id="admin-sidebar" />}
      </div>
    </AdminLayoutContext.Provider>
  );
};

export default AdminDashboardLayout;