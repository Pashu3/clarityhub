"use client";
import React from "react";
import { motion } from "framer-motion";
import { Palette, LayoutGrid, Brush, UploadCloud, Sun, Moon, Computer } from "lucide-react";

interface AppearanceProps {
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
}

export default function Appearance({ selectedTheme, setSelectedTheme }: AppearanceProps) {
  return (
    <motion.div
      key="appearance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Theme Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Palette className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Theme Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Theme Mode</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`p-4 border rounded-xl flex flex-col items-center cursor-pointer transition-all ${selectedTheme === 'light' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <input 
                  type="radio"
                  name="theme"
                  value="light"
                  checked={selectedTheme === 'light'}
                  onChange={() => setSelectedTheme('light')}
                  className="sr-only"
                />
                <div className="h-32 w-full bg-white border border-slate-200 rounded-lg mb-3 flex items-center justify-center">
                  <Sun className="h-12 w-12 text-amber-400" />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">Light</span>
              </label>
              
              <label className={`p-4 border rounded-xl flex flex-col items-center cursor-pointer transition-all ${selectedTheme === 'dark' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={selectedTheme === 'dark'}
                  onChange={() => setSelectedTheme('dark')}
                  className="sr-only"
                />
                <div className="h-32 w-full bg-slate-900 border border-slate-700 rounded-lg mb-3 flex items-center justify-center">
                  <Moon className="h-12 w-12 text-slate-100" />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">Dark</span>
              </label>
              
              <label className={`p-4 border rounded-xl flex flex-col items-center cursor-pointer transition-all ${selectedTheme === 'system' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <input 
                  type="radio"
                  name="theme"
                  value="system"
                  checked={selectedTheme === 'system'}
                  onChange={() => setSelectedTheme('system')}
                  className="sr-only"
                />
                <div className="h-32 w-full bg-gradient-to-r from-white to-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 flex items-center justify-center">
                  <Computer className="h-12 w-12 text-slate-600" />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">System</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Primary Color</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="primary-color"
                  value="purple"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 h-10 rounded-full bg-purple-600 peer-checked:ring-2 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-slate-800 peer-checked:ring-purple-600"></div>
                <span className="ml-3 text-slate-900 dark:text-white">Purple</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="primary-color"
                  value="blue"
                  className="sr-only peer"
                />
                <div className="w-10 h-10 rounded-full bg-blue-600 peer-checked:ring-2 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-slate-800 peer-checked:ring-blue-600"></div>
                <span className="ml-3 text-slate-900 dark:text-white">Blue</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="primary-color"
                  value="green"
                  className="sr-only peer"
                />
                <div className="w-10 h-10 rounded-full bg-green-600 peer-checked:ring-2 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-slate-800 peer-checked:ring-green-600"></div>
                <span className="ml-3 text-slate-900 dark:text-white">Green</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="primary-color"
                  value="custom"
                  className="sr-only peer"
                />
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 peer-checked:ring-2 peer-checked:ring-offset-2 dark:peer-checked:ring-offset-slate-800 peer-checked:ring-purple-600"></div>
                <span className="ml-3 text-slate-900 dark:text-white">Custom</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Custom CSS</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Add custom CSS to customize your application's appearance</p>
            <textarea 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              rows={5}
              placeholder="/* Add your custom CSS here */
:root {
  --brand-color: #6D28D9;
}"
            ></textarea>
          </div>
        </div>
      </div>
      
      {/* Layout Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <LayoutGrid className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Layout Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Sidebar Position</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Default position of application sidebar</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-position"
                  value="left"
                  className="w-4 h-4 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Left</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-position"
                  value="right"
                  className="w-4 h-4 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Right</span>
              </label>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Sidebar Behavior</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How the sidebar behaves</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="fixed">Fixed (always visible)</option>
              <option value="collapsible" selected>Collapsible</option>
              <option value="responsive">Responsive (auto-hide on mobile)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
            <h3 className="font-medium text-slate-900 dark:text-white">Content Width</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Maximum width of the content area</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="full-width">Full Width</option>
              <option value="contained" selected>Contained (1280px)</option>
              <option value="narrow">Narrow (1024px)</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Default Table Density</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Spacing in data tables</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="compact">Compact</option>
              <option value="normal" selected>Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Card Rounding</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Border radius for cards and containers</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="none">None (0px)</option>
              <option value="small">Small (4px)</option>
              <option value="medium" selected>Medium (8px)</option>
              <option value="large">Large (12px)</option>
              <option value="full">Full (9999px)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Branding Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Brush className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Branding Settings
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Light Mode Logo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Logo displayed in light mode</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-36 bg-white border border-slate-100 dark:border-slate-600 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/logo-light.png" alt="Light Logo" className="h-8 object-contain" />
              </div>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Change
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode Logo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Logo displayed in dark mode</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-36 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/logo-dark.png" alt="Dark Logo" className="h-8 object-contain" />
              </div>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Change
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Favicon</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Icon shown in browser tabs</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white border border-slate-100 dark:border-slate-600 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico" alt="Favicon" className="w-8 h-8 object-contain" />
              </div>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Change
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Login Page Background</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Background image for the login page</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-16 w-36 bg-gradient-to-r from-purple-500 to-indigo-600 border border-slate-100 dark:border-slate-600 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/login-bg.jpg" alt="Login Background" className="w-full h-full object-cover opacity-30" />
              </div>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <UploadCloud size={14} className="mr-1 inline-block" />
                Change
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Custom Font</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Primary font family for the application</p>
            </div>
            <select className="w-64 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="inter" selected>Inter</option>
              <option value="system">System UI</option>
              <option value="roboto">Roboto</option>
              <option value="opensans">Open Sans</option>
              <option value="custom">Custom Font</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}