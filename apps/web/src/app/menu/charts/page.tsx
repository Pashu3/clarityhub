"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSpreadsheet, ChevronLeft, Download, Share,
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, ScatterChart as ScatterChartIcon, 
  MoreHorizontal, Settings, Sparkles, Plus,
  XCircle, ArrowDownToLine, Play, Pause, Sliders,
  Info, CheckSquare, Save, Eye
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { useTheme } from "next-themes";

// Mock chart types
const chartTypes = [
  { id: "bar", name: "Bar Chart", icon: BarChart3 },
  { id: "line", name: "Line Chart", icon: LineChartIcon },
  { id: "pie", name: "Pie Chart", icon: PieChartIcon },
  { id: "scatter", name: "Scatter Plot", icon: ScatterChartIcon },
];

// Mock color palettes
const colorPalettes = [
  { id: "default", name: "Default", colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#673AB7", "#FF6D00"] },
  { id: "pastel", name: "Pastel", colors: ["#7CB9E8", "#C1E1C1", "#FFDBAA", "#FFC8DD", "#D0BFFF", "#DAEAF1"] },
  { id: "monochrome", name: "Monochrome", colors: ["#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5"] },
  { id: "contrast", name: "High Contrast", colors: ["#FF6D00", "#00C853", "#304FFE", "#AA00FF", "#FFD600", "#00BFA5"] },
];

// Mock data for different chart types
const generateMockBarData = () => [
  { name: 'Electronics', value: 400, quantity: 240 },
  { name: 'Clothing', value: 300, quantity: 139 },
  { name: 'Food', value: 200, quantity: 980 },
  { name: 'Furniture', value: 278, quantity: 390 },
  { name: 'Office', value: 189, quantity: 480 },
];

const generateMockLineData = () => [
  { name: 'Jan', sales: 4000, units: 2400 },
  { name: 'Feb', sales: 3000, units: 1398 },
  { name: 'Mar', sales: 2000, units: 9800 },
  { name: 'Apr', sales: 2780, units: 3908 },
  { name: 'May', sales: 1890, units: 4800 },
  { name: 'Jun', sales: 2390, units: 3800 },
  { name: 'Jul', sales: 3490, units: 4300 },
];

const generateMockPieData = () => [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 300 },
  { name: 'Furniture', value: 200 },
  { name: 'Office', value: 100 },
];

const generateMockScatterData = () => [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export default function Charts() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file");
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [activeChartType, setActiveChartType] = useState("bar");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState("default");
  const [charts, setCharts] = useState<any[]>([]);
  const [activeChart, setActiveChart] = useState<number>(0);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Update darkMode state when theme changes
  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock file details
      setFileDetails({
        id: fileId,
        name: "inventory_q1_2025.csv",
        rows: 250,
        columns: 8,
        size: 1024 * 1024 * 2.3
      });
      
      // Generate mock charts with Recharts data
      setCharts([
        { 
          id: 1, 
          type: "bar",
          title: "Product Category Distribution",
          description: "Distribution of products by category and their inventory levels",
          xAxis: "Category",
          yAxis: "Quantity",
          data: generateMockBarData(),
          dateCreated: new Date(2025, 3, 15)
        },
        { 
          id: 2, 
          type: "line",
          title: "Monthly Sales Trend",
          description: "Sales performance over the last 12 months",
          xAxis: "Month",
          yAxis: "Sales ($)",
          data: generateMockLineData(),
          dateCreated: new Date(2025, 3, 14)
        },
        { 
          id: 3, 
          type: "pie",
          title: "Revenue by Product Type",
          description: "Percentage breakdown of revenue sources",
          data: generateMockPieData(),
          dateCreated: new Date(2025, 3, 10)
        },
        { 
          id: 4, 
          type: "scatter",
          title: "Price vs. Quantity Relationship",
          description: "Correlation between product price and quantity sold",
          xAxis: "Price ($)",
          yAxis: "Quantity Sold",
          data: generateMockScatterData(),
          dateCreated: new Date(2025, 3, 8)
        }
      ]);
      
      setLoading(false);
    };
    
    fetchData();
  }, [fileId]);
  
  // Generate a new chart placeholder
  const createNewChart = () => {
    let newData;
    
    switch (activeChartType) {
      case 'bar':
        newData = generateMockBarData();
        break;
      case 'line':
        newData = generateMockLineData();
        break;
      case 'pie':
        newData = generateMockPieData();
        break;
      case 'scatter':
        newData = generateMockScatterData();
        break;
      default:
        newData = generateMockBarData();
    }
    
    const newChart = { 
      id: charts.length + 1, 
      type: activeChartType,
      title: `New ${chartTypes.find(c => c.id === activeChartType)?.name}`,
      description: "Newly created chart",
      xAxis: activeChartType !== 'pie' ? "X Axis" : undefined,
      yAxis: activeChartType !== 'pie' ? "Y Axis" : undefined,
      data: newData,
      dateCreated: new Date()
    };
    
    setCharts([...charts, newChart]);
    setActiveChart(charts.length);
  };
  
  // Handle chart deletion
  const deleteChart = (index: number) => {
    const newCharts = [...charts];
    newCharts.splice(index, 1);
    setCharts(newCharts);
    if (activeChart >= index && activeChart > 0) {
      setActiveChart(activeChart - 1);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Render active chart with Recharts
  const renderActiveChart = () => {
    if (!charts.length) return null;
    
    const chart = charts[activeChart];
    const colors = colorPalettes.find(p => p.id === selectedPalette)?.colors || colorPalettes[0].colors;
    const bgColor = darkMode ? '#1f2937' : '#ffffff';
    const textColor = darkMode ? '#d1d5db' : '#374151';
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chart.data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey="name" 
                tick={{ fill: textColor }}
              />
              <YAxis 
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: textColor,
                  border: `1px solid ${darkMode ? '#6b7280' : '#e5e7eb'}`
                }}
              />
              {showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill={colors[0]} 
                name="Value" 
                label={showDataLabels ? { fill: textColor, fontSize: 12 } : false}
              />
              <Bar 
                dataKey="quantity" 
                fill={colors[1]} 
                name="Quantity"
                label={showDataLabels ? { fill: textColor, fontSize: 12 } : false}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chart.data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey="name" 
                tick={{ fill: textColor }}
              />
              <YAxis 
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: textColor,
                  border: `1px solid ${darkMode ? '#6b7280' : '#e5e7eb'}`
                }}
              />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={colors[0]} 
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Sales"
                label={showDataLabels ? { fill: textColor, fontSize: 12 } : false}
              />
              <Line 
                type="monotone" 
                dataKey="units" 
                stroke={colors[1]} 
                strokeWidth={2}
                name="Units"
                label={showDataLabels ? { fill: textColor, fontSize: 12 } : false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie 
                data={chart.data} 
                cx="50%" 
                cy="50%" 
                outerRadius={150}
                fill={colors[0]}
                dataKey="value"
                nameKey="name"
                label={showDataLabels ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: textColor,
                  border: `1px solid ${darkMode ? '#6b7280' : '#e5e7eb'}`
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Price" 
                tick={{ fill: textColor }}
                label={{ value: 'Price ($)', position: 'insideBottomRight', offset: -5, fill: textColor }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Quantity"
                tick={{ fill: textColor }}
                label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fill: textColor }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: textColor,
                  border: `1px solid ${darkMode ? '#6b7280' : '#e5e7eb'}`
                }}
              />
              {showLegend && <Legend />}
              <Scatter 
                name="Products" 
                data={chart.data} 
                fill={colors[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <BarChart3 className="h-12 w-12 text-blue-400 dark:text-blue-500 opacity-50 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-48 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24 rounded-md mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
              <Link
                href={`/menu/explorer?file=${fileId}`}
                className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <FileSpreadsheet className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold">{fileDetails?.name}</h1>
            </div>
            <p className="mt-1 ml-11 text-gray-500 dark:text-gray-400">
              Data Visualizations • {charts.length} charts
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 text-sm border rounded-md shadow flex items-center space-x-2 
                ${showSettings 
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" 
                  : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            
            <button className="px-3 py-1.5 text-sm border rounded-md shadow flex items-center space-x-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <Link 
              href={`/menu/chat?file=${fileId}&ask=analyze%20this%20chart`}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md shadow flex items-center space-x-2 hover:bg-blue-600"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze with AI</span>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Chart type selector */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex space-x-3 overflow-x-auto py-2 hide-scrollbar"
      >
        {chartTypes.map((type) => (
          <motion.button
            key={type.id}
            variants={itemVariants}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 min-w-[120px] ${
              activeChartType === type.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveChartType(type.id)}
          >
            <type.icon className="h-4 w-4" />
            <span>{type.name}</span>
          </motion.button>
        ))}
        
        <motion.button
          variants={itemVariants}
          className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-800/40"
          onClick={createNewChart}
        >
          <Plus className="h-4 w-4" />
          <span>Create New</span>
        </motion.button>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - Saved charts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 rounded-xl shadow-md overflow-hidden max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-medium">Saved Visualizations</h2>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Select a chart to view or edit
            </p>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {charts.map((chart, index) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:bg-opacity-50 cursor-pointer ${
                  activeChart === index ? "bg-blue-50 border-l-4 border-l-blue-500 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => setActiveChart(index)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {chart.type === 'bar' && <BarChart3 className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />}
                    {chart.type === 'line' && <LineChartIcon className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />}
                    {chart.type === 'pie' && <PieChartIcon className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />}
                    {chart.type === 'scatter' && <ScatterChartIcon className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />}
                    <span className="font-medium text-sm truncate max-w-[140px]">{chart.title}</span>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChart(index);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs mt-1 truncate text-gray-500 dark:text-gray-400">
                  {chart.description}
                </p>
                <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
                  {chart.dateCreated.toLocaleDateString()}
                </p>
              </motion.div>
            ))}
            
            {charts.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No charts yet</p>
                <button 
                  className="mt-4 text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  onClick={createNewChart}
                >
                  Create your first visualization
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Main content - Chart view */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:col-span-3 rounded-xl shadow-md overflow-hidden flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          {charts.length > 0 ? (
            <>
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <h2 className="font-medium">{charts[activeChart].title}</h2>
                    <button className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    {charts[activeChart].description}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <Share className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div 
                ref={chartContainerRef} 
                className="flex-1 flex items-center justify-center p-4 bg-white dark:bg-gray-800"
              >
                {renderActiveChart()}
              </div>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {charts[activeChart].type === 'bar' || charts[activeChart].type === 'line' || charts[activeChart].type === 'scatter' ? (
                      <>
                        <span className="font-medium">Axes:</span>{" "}
                        {charts[activeChart].xAxis} × {charts[activeChart].yAxis}
                      </>
                    ) : (
                      <span>Showing data distribution</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm rounded-md flex items-center space-x-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Improve</span>
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-1">
                      <Save className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-700 dark:text-gray-300">
              <BarChart3 className="h-16 w-16 mb-4 text-gray-200 dark:text-gray-600" />
              <h3 className="text-lg font-medium">No Chart Selected</h3>
              <p className="max-w-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                Create a new visualization or select an existing chart from the sidebar.
              </p>
              <button 
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center space-x-2"
                onClick={createNewChart}
              >
                <Plus className="h-4 w-4" />
                <span>Create New Chart</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="rounded-xl shadow-lg max-w-xl w-full mx-4 overflow-hidden bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-medium">Chart Settings</h3>
                <button onClick={() => setShowSettings(false)}>
                  <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Color Palette</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPalettes.map(palette => (
                        <button
                          key={palette.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedPalette === palette.id 
                              ? "ring-2 ring-blue-500 border-blue-200 dark:border-blue-800" 
                              : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setSelectedPalette(palette.id)}
                        >
                          <div className="flex space-x-1 mb-2">
                            {palette.colors.map((color, i) => (
                              <div 
                                key={i} 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-sm">{palette.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Appearance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Show grid lines
                        </label>
                        <button 
                          className={`w-10 h-5 rounded-full relative ${
                            showGridLines
                              ? 'bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                          onClick={() => setShowGridLines(!showGridLines)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                            showGridLines ? 'right-0.5' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Show legends
                        </label>
                        <button 
                          className={`w-10 h-5 rounded-full relative ${
                            showLegend
                              ? 'bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                          onClick={() => setShowLegend(!showLegend)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                            showLegend ? 'right-0.5' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Show data labels
                        </label>
                        <button 
                          className={`w-10 h-5 rounded-full relative ${
                            showDataLabels
                              ? 'bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                          onClick={() => setShowDataLabels(!showDataLabels)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                            showDataLabels ? 'right-0.5' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Dark mode
                        </label>
                        <button 
                          className={`w-10 h-5 rounded-full relative ${
                            darkMode
                              ? 'bg-blue-500'
                              : 'bg-gray-200'
                          }`}
                          onClick={() => setDarkMode(!darkMode)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                            darkMode ? 'right-0.5' : 'left-0.5'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Data</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm block mb-1 text-gray-700 dark:text-gray-300">
                          Data range
                        </label>
                        <select className="w-full border rounded-md p-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          <option>All data</option>
                          <option>Last 30 days</option>
                          <option>Last quarter</option>
                          <option>Custom range...</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm block mb-1 text-gray-700 dark:text-gray-300">
                          Aggregation
                        </label>
                        <select className="w-full border rounded-md p-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          <option>Sum</option>
                          <option>Average</option>
                          <option>Minimum</option>
                          <option>Maximum</option>
                          <option>Count</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-700">
                <button 
                  className="px-4 py-2 text-sm rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setShowSettings(false)}
                >
                  Apply Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating action button */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-6 right-6"
      >
        <Link
          href={`/menu/chat?file=${fileId}&ask=create%20a%20chart%20of%20monthly%20trends`}
          className="h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">AI Chart Builder</span>
        </Link>
      </motion.div>
    </div>
  );
}