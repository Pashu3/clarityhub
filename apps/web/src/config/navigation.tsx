import { 
    LayoutDashboard, 
    FileSpreadsheet, 
    MessageSquare, 
    BarChart3,
    Upload, 
    Settings,
    Users
  } from "lucide-react";
  
  export type NavigationItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    description: string;
    adminOnly?: boolean;
  };
  
  export const navigationItems: NavigationItem[] = [
    { 
      name: "Dashboard", 
      href: "/menu/dashboard", 
      icon: LayoutDashboard,
      description: "Overview and insights"
    },
    { 
      name: "Uploads", 
      href: "/menu/uploads", 
      icon: Upload,
      description: "Manage your datasets"
    },
    { 
      name: "Explorer", 
      href: "/menu/explorer", 
      icon: FileSpreadsheet,
      description: "Browse and analyze data"
    },
    { 
      name: "AI Chat", 
      href: "/menu/chat", 
      icon: MessageSquare,
      description: "Get AI-powered insights"
    },
    { 
      name: "Shared Chats", 
      href: "/menu/shared-chat", 
      icon: Users,
      description: "Conversations shared with you"
    },
    { 
      name: "Charts", 
      href: "/menu/charts", 
      icon: BarChart3,
      description: "Visualize your data"
    },
    { 
      name: "Settings", 
      href: "/menu/settings", 
      icon: Settings,
      description: "Customize your workspace"
    },
   
  ];