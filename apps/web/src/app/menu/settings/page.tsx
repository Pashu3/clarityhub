"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  User, ShieldCheck, Bell, Palette, 
  Globe, Monitor, Database, Key, LogOut,
  ChevronRight, Check, Save, X, ChevronDown,
  Mail, Cloud, CreditCard, FileText, Users,
  Edit, Camera, Loader2
} from "lucide-react";
import { useTheme } from "next-themes";

// Settings sections
const settingsSections = [
  { id: "account", name: "Account", icon: User },
  { id: "security", name: "Security", icon: ShieldCheck },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "language", name: "Language & Region", icon: Globe },
  { id: "integrations", name: "Integrations", icon: Database },
  { id: "billing", name: "Billing & Plans", icon: CreditCard },
  { id: "team", name: "Team Members", icon: Users },
  { id: "privacy", name: "Privacy", icon: Key },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(true);
  const [userSettings, setUserSettings] = useState({
    // Account settings
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    jobTitle: "Data Analyst",
    company: "Acme Analytics",
    profileImage: null,
    
    // Appearance settings
    theme: "system", // "light", "dark", "system"
    density: "comfortable", // "compact", "comfortable", "spacious"
    fontSize: "medium", // "small", "medium", "large"
    colorAccent: "blue", // "blue", "green", "purple", "orange"
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    notifyOnShares: true,
    notifyOnComments: true,
    notifyOnUpdates: true,
    weeklyDigest: true,
    
    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    
    // Language settings
    language: "en-US",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    
    // Privacy settings
    dataSharing: true,
    usageAnalytics: true,
    
    // Billing settings
    plan: "Pro",
    billingCycle: "Monthly",
    paymentMethod: {
      type: "card",
      last4: "4242",
      expires: "01/2026"
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Simulating loading user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };
    
    fetchUserSettings();
  }, []);
  
  // Handle settings save
  const saveSettings = async (updatedSettings: any) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Handle theme change
    if (updatedSettings.theme && updatedSettings.theme !== userSettings.theme) {
      setTheme(updatedSettings.theme);
    }
    
    setUserSettings({
      ...userSettings,
      ...updatedSettings
    });
    
    setIsSaving(false);
    setIsEditing(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Render specific settings section
  const renderSettingsSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-sm flex items-center px-3 py-1 rounded ${
                    isEditing 
                      ? "text-red-500 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200"
                      : "text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full overflow-hidden relative bg-gray-100 dark:bg-gray-700">
                    {userSettings.profileImage ? (
                      <img 
                        src={userSettings.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={userSettings.name}
                          onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                          className="w-full p-2 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />
                      ) : (
                        <p className="text-sm">{userSettings.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          value={userSettings.email}
                          onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                          className="w-full p-2 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />
                      ) : (
                        <p className="text-sm">{userSettings.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                        Job Title
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={userSettings.jobTitle}
                          onChange={(e) => setUserSettings({...userSettings, jobTitle: e.target.value})}
                          className="w-full p-2 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />
                      ) : (
                        <p className="text-sm">{userSettings.jobTitle}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                        Company / Organization
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={userSettings.company}
                          onChange={(e) => setUserSettings({...userSettings, company: e.target.value})}
                          className="w-full p-2 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                        />
                      ) : (
                        <p className="text-sm">{userSettings.company}</p>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => saveSettings(userSettings)}
                        disabled={isSaving}
                        className={`px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center ${
                          isSaving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Linked Accounts */}
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Linked Accounts</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium text-sm">Google</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Connected as {userSettings.email}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                      Disconnect
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium text-sm">Dropbox</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Not connected
                        </p>
                      </div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "appearance":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Theme Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Color Theme</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['light', 'dark', 'system'].map((themeOption) => (
                      <button
                        key={themeOption}
                        className={`p-3 rounded-lg border ${
                          userSettings.theme === themeOption
                            ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" 
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => saveSettings({ theme: themeOption })}
                      >
                        <div className="flex justify-center mb-2">
                          {themeOption === 'light' && (
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                              <Monitor className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                          {themeOption === 'dark' && (
                            <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-sm">
                              <Monitor className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                          {themeOption === 'system' && (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white to-gray-800 border border-gray-200 flex items-center justify-center shadow-sm">
                              <Monitor className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm capitalize">{themeOption}</p>
                          {userSettings.theme === themeOption && (
                            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                              Currently active
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Color Accent</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'blue', color: '#3b82f6' },
                      { id: 'green', color: '#10b981' },
                      { id: 'purple', color: '#8b5cf6' },
                      { id: 'orange', color: '#f97316' },
                      { id: 'pink', color: '#ec4899' },
                      { id: 'teal', color: '#14b8a6' }
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          userSettings.colorAccent === accent.id
                            ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400 dark:ring-offset-gray-800" 
                            : ""
                        }`}
                        style={{ backgroundColor: accent.color }}
                        onClick={() => saveSettings({ colorAccent: accent.id })}
                      >
                        {userSettings.colorAccent === accent.id && (
                          <Check className="h-5 w-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Density</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['compact', 'comfortable', 'spacious'].map((density) => (
                      <button
                        key={density}
                        className={`p-3 rounded-lg border ${
                          userSettings.density === density
                            ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" 
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => saveSettings({ density })}
                      >
                        <div className="flex justify-center mb-2">
                          <div className="h-12 w-12 flex flex-col items-center justify-center border-gray-200 dark:border-gray-700">
                            {density === 'compact' && (
                              <div className="space-y-1">
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                              </div>
                            )}
                            {density === 'comfortable' && (
                              <div className="space-y-2">
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                              </div>
                            )}
                            {density === 'spacious' && (
                              <div className="space-y-3">
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm capitalize">{density}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Font Size</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        className={`p-3 rounded-lg border ${
                          userSettings.fontSize === size
                            ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" 
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => saveSettings({ fontSize: size })}
                      >
                        <div className="flex justify-center mb-2">
                          <div className="h-10 flex items-center">
                            {size === 'small' && <span className="text-sm">Aa</span>}
                            {size === 'medium' && <span className="text-base">Aa</span>}
                            {size === 'large' && <span className="text-lg">Aa</span>}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm capitalize">{size}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Notification Preferences</h3>
              
              <div className="space-y-5">
                <p className="text-sm italic mb-2">Choose which notifications you'd like to receive</p>
                
                <div className="space-y-3">
                  {[
                    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { id: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications in your browser' },
                    { id: 'notifyOnShares', label: 'File Shares', description: 'When someone shares a file with you' },
                    { id: 'notifyOnComments', label: 'Comments', description: 'When someone comments on your data' },
                    { id: 'notifyOnUpdates', label: 'Updates & Features', description: 'Learn about new features and updates' },
                    { id: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a summary of activity once a week' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{notification.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.description}
                        </p>
                      </div>
                      <button 
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          userSettings[notification.id as keyof typeof userSettings]
                            ? 'bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                        onClick={() => saveSettings({ 
                          [notification.id]: !userSettings[notification.id as keyof typeof userSettings] 
                        })}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                          userSettings[notification.id as keyof typeof userSettings] ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button 
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        userSettings.twoFactorEnabled
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => saveSettings({ twoFactorEnabled: !userSettings.twoFactorEnabled })}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                        userSettings.twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                    </button>
                  </div>
                  
                  {userSettings.twoFactorEnabled && (
                    <div className="mt-3 p-3 rounded text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100">
                      Two-factor authentication is enabled. Your account is secure.
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mt-4 space-y-4 border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium mb-2">Session Timeout</p>
                    <p className="text-xs mb-3 text-gray-500 dark:text-gray-400">
                      Automatically log out after a period of inactivity
                    </p>
                    
                    <select 
                      value={userSettings.sessionTimeout}
                      onChange={(e) => saveSettings({ sessionTimeout: parseInt(e.target.value) })}
                      className="w-full p-2 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Password</p>
                    <button className="px-4 py-2 text-sm rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Change Password
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium mb-2">Active Sessions</p>
                  
                  <div className="p-3 rounded-lg border mb-3 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full mr-2 bg-green-500 dark:bg-green-400"></div>
                          <p className="text-sm font-medium">Current Session</p>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          Windows • Chrome • New York, US
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Now
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Mobile App</p>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          iOS • San Francisco, US
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xs mr-3 text-gray-500 dark:text-gray-400">
                          2 days ago
                        </p>
                        <button className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "billing":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Current Plan</h3>
              
              <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                      {userSettings.plan} Plan
                    </p>
                    <p className="text-2xl font-bold mt-1">$49<span className="text-sm font-normal">/month</span></p>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      Billing {userSettings.billingCycle.toLowerCase()} • Renews on May 9, 2025
                    </p>
                  </div>
                  
                  <button className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                    Change Plan
                  </button>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <p className="text-sm">Unlimited datasets</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <p className="text-sm">Advanced analytics</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <p className="text-sm">Team collaboration (up to 10 users)</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <p className="text-sm">Custom branding</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                
                <div className="p-3 rounded-lg border flex justify-between items-center border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-16 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Visa ending in {userSettings.paymentMethod.last4}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expires {userSettings.paymentMethod.expires}
                      </p>
                    </div>
                  </div>
                  
                  <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
                    Update
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Billing History</h4>
                
                <div className="rounded-lg border overflow-hidden border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead className="text-xs bg-gray-50 text-gray-500 dark:bg-gray-750 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Amount</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { date: 'Apr 9, 2025', amount: '$49.00', status: 'Paid' },
                        { date: 'Mar 9, 2025', amount: '$49.00', status: 'Paid' },
                        { date: 'Feb 9, 2025', amount: '$49.00', status: 'Paid' },
                      ].map((invoice, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-800">
                          <td className="px-4 py-3 text-sm">{invoice.date}</td>
                          <td className="px-4 py-3 text-sm">{invoice.amount}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="flex items-center text-sm text-blue-500">
                              <FileText className="h-4 w-4 mr-1" />
                              PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">
                {settingsSections.find(s => s.id === activeSection)?.name} Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This section is under development
              </p>
            </div>
          </div>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <User className="h-12 w-12 text-blue-400 dark:text-blue-500 opacity-50 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-48 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24 rounded-md mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md mb-6"
      >
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and application settings
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          <nav className="p-1">
            <ul className="space-y-1">
              {settingsSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100" 
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <section.icon className={`h-5 w-5 mr-3 ${
                      activeSection === section.id
                        ? "text-blue-500 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`} />
                    <span>{section.name}</span>
                    
                    <ChevronRight className={`ml-auto h-4 w-4 ${
                      activeSection === section.id
                        ? "text-blue-500 dark:text-blue-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20">
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
        
        {/* Settings content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-3"
        >
          {renderSettingsSection()}
        </motion.div>
      </div>
    </div>
  );
}