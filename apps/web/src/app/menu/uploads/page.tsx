"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Upload, 
  FileSpreadsheet, 
  Plus, 
  Check, 
  X, 
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Trash2,
  Eye,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Define proper types for uploads
interface BaseUpload {
  id: number;
  name: string;
  date: string;
  size: number;
  status: string;
}

interface SuccessUpload extends BaseUpload {
  status: "success";
  rows: number;
  columns: number;
  error?: undefined;
}

interface ErrorUpload extends BaseUpload {
  status: "error";
  error: string;
  rows?: undefined;
  columns?: undefined;
}

type Upload = SuccessUpload | ErrorUpload;

// Mock data for upload history
const mockUploads: Upload[] = [
  { 
    id: 1, 
    name: "sales_q1_2025.csv", 
    date: "2025-04-20T14:48:00", 
    size: 1024 * 1024 * 2.3, 
    status: "success",
    rows: 1248,
    columns: 12
  },
  { 
    id: 2, 
    name: "customer_feedback.csv", 
    date: "2025-04-18T09:23:00", 
    size: 1024 * 512, 
    status: "success",
    rows: 548,
    columns: 8
  },
  { 
    id: 3, 
    name: "inventory_march.csv", 
    date: "2025-04-15T16:10:00", 
    size: 1024 * 1024 * 1.1, 
    status: "success",
    rows: 3782,
    columns: 15
  },
  { 
    id: 4, 
    name: "broken_data.csv", 
    date: "2025-04-10T11:35:00", 
    size: 1024 * 128, 
    status: "error",
    error: "Invalid CSV format: Mismatched columns"
  }
];

export default function UploadsPage() {
  const { theme } = useTheme();
  
  const [uploads, setUploads] = useState<Upload[]>(mockUploads);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    // Filter for CSV files only
    const csvFiles = files.filter(file => 
      file.name.endsWith('.csv') || file.type === 'text/csv'
    );
    
    if (csvFiles.length === 0) {
      // Show error toast or notification
      console.error("Please upload CSV files only");
      return;
    }
    
    handleFileUpload(csvFiles);
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (files: File[]) => {
    // Initialize progress for each file
    const initialProgress: {[key: string]: number} = {};
    files.forEach(file => {
      initialProgress[file.name] = 0;
    });
    setUploadProgress(initialProgress);
    
    // Simulate upload progress for each file
    files.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // After "upload" completes, add to uploads list with small delay to finish animation
          setTimeout(() => {
            setUploads(prev => {
              const isError = Math.random() > 0.9;
              
              const newUpload: Upload = isError 
                ? {
                    id: Date.now(),
                    name: file.name,
                    date: new Date().toISOString(),
                    size: file.size,
                    status: "error",
                    error: "Invalid CSV format: Mismatched columns"
                  }
                : {
                    id: Date.now(),
                    name: file.name,
                    date: new Date().toISOString(),
                    size: file.size,
                    status: "success",
                    rows: Math.floor(Math.random() * 5000) + 100,
                    columns: Math.floor(Math.random() * 20) + 3
                  };
              
              return [newUpload, ...prev];
            });
            
            // Clear progress after a delay
            setTimeout(() => {
              setUploadProgress(prev => {
                const newProgress = {...prev};
                delete newProgress[file.name];
                return newProgress;
              });
            }, 1000);
          }, 500);
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      }, 200);
    });
  };

  const toggleExpandedItem = (id: number) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Header with gradient background */}
      <motion.div 
        variants={item} 
        className="rounded-xl p-8 shadow-lg bg-gradient-to-r from-primary/10 to-primary/5 dark:from-blue-900/20 dark:to-blue-900/5"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">CSV Uploads</h1>
        <p className="text-muted-foreground max-w-2xl">
          Upload your CSV files here for instant analysis and visualization. 
          Our AI will process your data and provide actionable insights.
        </p>
      </motion.div>

      {/* File upload area */}
      <motion.div 
        variants={item}
        className={cn(
          "relative rounded-xl p-10 transition-all duration-300 bg-card dark:bg-gray-800 hover:shadow-xl dark:hover:shadow-lg",
          isDragging && "shadow-xl bg-primary/5 dark:bg-blue-900/10 ring-2 ring-primary/30 dark:ring-blue-500/30"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            className={cn(
              "mb-6 rounded-full p-6 transition-all duration-300 bg-accent dark:bg-gray-700 text-primary dark:text-blue-400 shadow-inner",
              isDragging && "bg-primary/20 dark:bg-blue-900/20 text-primary dark:text-blue-400 scale-110"
            )}
            animate={{ 
              y: isDragging ? [0, -10, 0] : 0 
            }}
            transition={{ 
              repeat: isDragging ? Infinity : 0, 
              duration: 1.5 
            }}
          >
            <Upload className="h-12 w-12" />
          </motion.div>
          
          <h3 className="text-2xl font-semibold mb-3">
            {isDragging ? 'Drop CSV Files Here' : 'Upload Your CSV Files'}
          </h3>
          
          <p className="text-muted-foreground mb-8 max-w-lg text-center">
            Drag and drop your CSV files here, or use the button below to browse your computer.
            We'll automatically analyze your data and prepare it for exploration.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleFileSelect}
              className="flex items-center space-x-2 shadow-md hover:shadow-xl transition-all px-6 py-5 h-auto"
              size="lg"
            >
              <Plus size={20} />
              <span className="font-medium">Select CSV Files</span>
            </Button>
            
            <Button
              as={Link}
              href="/dashboard"
              variant="outline"
              className="shadow hover:shadow-md transition-all"
            >
              Cancel
            </Button>
          </div>
          
          {/* Guidelines */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { icon: FileSpreadsheet, title: "CSV Files Only", desc: "Make sure your files are in CSV format" },
              { icon: BarChart3, title: "Auto Analysis", desc: "Your data will be analyzed automatically" },
              { icon: Check, title: "Data Privacy", desc: "Your data is secure and private" }
            ].map((item, i) => (
              <div key={i} className="flex items-start p-4 rounded-lg shadow-sm bg-accent/50 dark:bg-gray-700/50">
                <div className="rounded-full p-2 mr-3 bg-primary/10 dark:bg-blue-900/20 text-primary dark:text-blue-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </motion.div>

      {/* Progress bars for uploading files */}
      <AnimatePresence>
        {Object.keys(uploadProgress).length > 0 && (
          <motion.div 
            key="progress"
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl shadow-lg p-6 bg-card dark:bg-gray-800"
          >
            <div className="flex items-center mb-4">
              <div className="mr-3 rounded-full p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Uploading Files</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
                      <span className="text-sm font-medium truncate max-w-xs">{filename}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground px-2 py-1 rounded-full bg-accent dark:bg-gray-700">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden shadow-inner bg-accent dark:bg-gray-700">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-primary-light dark:from-blue-600 dark:to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload history */}
      {uploads.length > 0 && (
        <motion.div 
          variants={item} 
          className="rounded-xl shadow-lg overflow-hidden bg-card dark:bg-gray-800"
        >
          <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <h2 className="text-xl font-semibold">Upload History</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your previously uploaded CSV files
            </p>
          </div>

          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {uploads.map((file) => (
              <motion.li 
                key={file.id}
                className="cursor-pointer transition-all hover:bg-accent/30 dark:hover:bg-gray-700/50"
                onClick={() => toggleExpandedItem(file.id)}
                whileHover={{ x: 4 }}
                layout
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={
                        file.status === "success" 
                          ? "rounded-full p-3 shadow-sm bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "rounded-full p-3 shadow-sm bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      }>
                        {file.status === "success" 
                          ? <Check className="h-5 w-5" /> 
                          : <X className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <FileSpreadsheet className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
                          <p className="font-medium text-base">{file.name}</p>
                          {file.status === "error" && (
                            <div className="ml-2 flex items-center text-red-500 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs font-semibold">Error</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(file.date).toLocaleString()} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                      {file.status === "success" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          as={Link}
                          href={`/dashboard/explorer?file=${file.id}`}
                          className="hover:shadow-sm transition-shadow"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:shadow-sm transition-shadow"
                        onClick={(e) => handleDelete(file.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <div className="ml-2 rounded-full p-1 transition-colors bg-accent hover:bg-accent/70 dark:bg-gray-700 dark:hover:bg-gray-600">
                        <ChevronDown 
                          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${expandedItem === file.id ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedItem === file.id && (
                      <motion.div 
                        className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {file.status === "success" ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg shadow-sm bg-gradient-to-br from-accent to-accent/50 dark:from-gray-700 dark:to-gray-700/50">
                              <p className="text-sm font-medium mb-1 text-muted-foreground">Total Rows</p>
                              <p className="text-2xl font-bold">{file.rows.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-lg shadow-sm bg-gradient-to-br from-accent to-accent/50 dark:from-gray-700 dark:to-gray-700/50">
                              <p className="text-sm font-medium mb-1 text-muted-foreground">Total Columns</p>
                              <p className="text-2xl font-bold">{file.columns}</p>
                            </div>
                            <div className="p-4 rounded-lg shadow-sm bg-gradient-to-br from-accent to-accent/50 dark:from-gray-700 dark:to-gray-700/50">
                              <p className="text-sm font-medium mb-1 text-muted-foreground">File Size</p>
                              <p className="text-2xl font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            
                            <div className="md:col-span-3 flex justify-end mt-3">
                              <Button
                                as={Link}
                                href={`/dashboard/explorer?file=${file.id}`}
                                className="shadow-md hover:shadow-xl transition-all group px-6"
                              >
                                Analyze Data 
                                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 rounded-lg bg-gradient-to-r from-red-50 to-red-50/30 dark:from-red-900/20 dark:to-red-900/10">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-red-500 dark:text-red-400" />
                              <div>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">Error Details</p>
                                <p className="text-sm mt-1">{file.error}</p>
                                <div className="mt-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="shadow hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                                  >
                                    Retry Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}