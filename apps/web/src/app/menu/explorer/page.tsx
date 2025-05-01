"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, FileSpreadsheet, Search, Filter,
  Download, X, ArrowUpDown, ChevronLeft, 
  ChevronRight, Sparkles, SlidersHorizontal
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Mock data
const mockColumns = [
  { id: "id", name: "ID", type: "number" },
  { id: "name", name: "Product Name", type: "string" },
  { id: "category", name: "Category", type: "string" },
  { id: "price", name: "Price", type: "number" },
  { id: "quantity", name: "Quantity", type: "number" },
  { id: "date", name: "Date", type: "date" },
  { id: "supplier", name: "Supplier", type: "string" },
  { id: "status", name: "Status", type: "string" }
];

// Generate mock data
const generateMockData = (count = 50) => {
  const statuses = ["In Stock", "Low Stock", "Out of Stock"];
  const categories = ["Electronics", "Clothing", "Food", "Furniture", "Office"];
  const suppliers = ["TechCorp", "FashionHub", "FoodWorld", "HomeStyle", "OfficeMax"];
  const products = [
    "Ultra Laptop", "Smart Watch", "Wireless Earbuds", "Designer T-shirt", 
    "Office Chair", "Standing Desk", "File Cabinet"
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${products[Math.floor(Math.random() * products.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: +(Math.random() * 1000).toFixed(2),
    quantity: Math.floor(Math.random() * 1000),
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export default function Explorer() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file");
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [columns] = useState(mockColumns);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("data");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  
  // Basic file details
  const [fileDetails, setFileDetails] = useState({
    name: "",
    rows: 0,
    columns: 0,
    size: 0
  });
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = generateMockData(100);
      setData(mockData);
      setVisibleColumns(mockColumns.map(col => col.id));
      
      setFileDetails({
        name: "inventory_q1_2025.csv",
        rows: mockData.length,
        columns: mockColumns.length,
        size: 1024 * 1024 * 2.3
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, [fileId]);
  
  // Basic search filter (can be expanded later)
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(
      value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Simple pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  // Calculate simple summary stats for numeric columns
  const summaryStats = columns
    .filter(col => col.type === "number")
    .reduce((acc, col) => {
      const values = filteredData.map(item => Number(item[col.id]));
      const sum = values.reduce((a, b) => a + b, 0);
      
      acc[col.id] = {
        sum,
        avg: values.length ? sum / values.length : 0,
        min: values.length ? Math.min(...values) : 0,
        max: values.length ? Math.max(...values) : 0
      };
      return acc;
    }, {} as Record<string, any>);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <FileSpreadsheet className="h-12 w-12 text-blue-500 dark:text-blue-400 opacity-50 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-48 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24 rounded-md mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent rounded-xl p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{fileDetails.name}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {fileDetails.rows.toLocaleString()} rows • {fileDetails.columns} columns • 
              {" "}{(fileDetails.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow dark:shadow-gray-900/10 flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <Link 
              href={`/dashboard/chat?file=${fileId}`}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md shadow flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze with AI</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text"
            placeholder="Search all columns..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-9 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow dark:shadow-gray-900/10 flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Columns</span>
          </button>
          
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow dark:shadow-gray-900/10 flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <Link
            href={`/dashboard/charts?file=${fileId}`}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow dark:shadow-gray-900/10 flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Visualize</span>
          </Link>
        </div>
      </div>
      
      {/* Data tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'data' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('data')}
            >
              Data Table
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'summary' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
          </div>
        </div>
        
        {activeTab === 'data' ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {columns
                      .filter(column => visibleColumns.includes(column.id))
                      .map(column => (
                        <th key={column.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          <button
                            className="flex items-center"
                            onClick={() => {/* Sort function would go here */}}
                          >
                            {column.name}
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          </button>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {columns
                        .filter(column => visibleColumns.includes(column.id))
                        .map(column => (
                          <td key={`${rowIndex}-${column.id}`} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {column.type === 'number' 
                              ? parseFloat(row[column.id]).toLocaleString(undefined, {
                                  maximumFractionDigits: 2
                                })
                              : row[column.id]}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredData.length ? (currentPage - 1) * rowsPerPage + 1 : 0} 
                to {Math.min(currentPage * rowsPerPage, filteredData.length)} 
                of {filteredData.length} results
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 bg-white dark:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <button 
                        key={pageToShow}
                        onClick={() => setCurrentPage(pageToShow)}
                        className={`h-8 w-8 p-0 flex items-center justify-center rounded ${
                          currentPage === pageToShow 
                            ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 bg-white dark:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summaryStats).map(([key, stats]) => {
                const column = columns.find(col => col.id === key);
                return (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">{column?.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sum</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                          {stats.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                          {stats.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                          {stats.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                          {stats.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                href={`/dashboard/chat?file=${fileId}&ask=summarize%20this%20data`}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md shadow flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate AI Summary</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Link
          href={`/dashboard/chat?file=${fileId}`}
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-lg flex items-center justify-center transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Analyze with AI</span>
        </Link>
      </div>
    </div>
  );
}