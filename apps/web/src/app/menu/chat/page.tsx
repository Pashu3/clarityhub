"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSpreadsheet, ChevronLeft, Download, 
  Send, Sparkles, Bot, User, Share, 
  MessagesSquare, PlusCircle, MoreHorizontal,
  Loader2, Image, Mic, Paperclip, LightbulbIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Message types
type MessageType = "user" | "assistant" | "system";
type AttachmentType = "image" | "chart" | "file";

interface Attachment {
  type: AttachmentType;
  url: string;
  preview?: string;
  name?: string;
}

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  loading?: boolean;
  attachments?: Attachment[];
}

// Suggestions for new users
const initialSuggestions = [
  "Summarize the key insights from this data",
  "What are the top selling products?",
  "Compare sales across different categories",
  "Find outliers in this dataset",
  "Create a visualization of monthly trends",
  "What recommendations do you have based on this data?"
];

export default function Chat() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file");
  const initialQuestion = searchParams.get("ask");
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock file details
      setFileDetails({
        id: fileId,
        name: "inventory_q1_2025.csv",
        rows: 250,
        columns: 8,
        size: 1024 * 1024 * 2.3,
        lastModified: "2025-03-15"
      });
      
      // Add initial system message
      const welcomeMessage: Message = {
        id: "system-welcome",
        content: "I'm your AI data assistant. How can I help you analyze this dataset today?",
        type: "system",
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setLoading(false);
      
      // If there's an initial question, send it
      if (initialQuestion) {
        setTimeout(() => {
          handleSend(initialQuestion);
        }, 500);
      }
    };
    
    fetchData();
  }, [fileId, initialQuestion]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle sending a message
  const handleSend = async (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      type: "user",
      timestamp: new Date()
    };
    
    // Create placeholder for assistant response
    const assistantPlaceholder: Message = {
      id: `assistant-${Date.now()}`,
      content: "",
      type: "assistant",
      timestamp: new Date(),
      loading: true
    };
    
    // Update messages
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setInput("");
    setIsSending(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock response based on user query
    let response = "";
    let attachments: Attachment[] | undefined = undefined;
    
    if (messageContent.toLowerCase().includes("summarize")) {
      response = "Looking at this inventory dataset, I can see several key patterns. Electronics make up 35% of total inventory value, with Ultra Laptops being the highest value items. 23% of products are currently low or out of stock, with Wireless Earbuds showing the highest stockout rate. The average item value is $342.75, and your inventory turnover rate appears healthy for most categories except Office supplies.";
    } else if (messageContent.toLowerCase().includes("top selling") || messageContent.toLowerCase().includes("best performing")) {
      response = "Based on the quantity data, your top selling products are:\n\n1. Wireless Earbuds (28% of total sales)\n2. Smart Watches (21% of total sales)\n3. Ultra Laptops (15% of total sales)\n\nElectronics generally outperform other categories, accounting for 64% of total sales volume.";
      
      // Add a chart attachment
      attachments = [{
        type: "chart",
        url: "https://example.com/chart1.png",
        preview: "https://placehold.co/600x400/e2f2ff/2693e6?text=Sales+Distribution+Chart"
      }];
    } else if (messageContent.toLowerCase().includes("compare") || messageContent.toLowerCase().includes("categories")) {
      response = "Comparing across categories:\n\n- Electronics: Highest total value ($2.3M), moderate inventory levels\n- Clothing: Lowest value per item ($42.50 avg), highest quantity \n- Food: Fastest turnover rate, lowest stock levels\n- Furniture: Highest value per item ($650.75 avg), slowest turnover\n- Office: Most consistent inventory levels, moderate values";
      
      attachments = [{
        type: "chart",
        url: "https://example.com/chart2.png",
        preview: "https://placehold.co/600x400/e2f2ff/2693e6?text=Category+Comparison+Chart"
      }];
    } else if (messageContent.toLowerCase().includes("visual") || messageContent.toLowerCase().includes("chart") || messageContent.toLowerCase().includes("graph")) {
      response = "I've created a visualization of your inventory data. The chart shows the distribution of products by category and their respective inventory levels. Electronics dominate in terms of value, while clothing has the highest item count.";
      
      attachments = [{
        type: "chart",
        url: "https://example.com/chart3.png",
        preview: "https://placehold.co/600x400/e2f2ff/2693e6?text=Inventory+Distribution+Chart"
      }];
    } else if (messageContent.toLowerCase().includes("outlier") || messageContent.toLowerCase().includes("unusual")) {
      response = "I've detected several outliers in your inventory data:\n\n1. Ultra Laptop G87 - Priced 43% above category average\n2. Designer T-shirt X21 - 85% below expected stock level\n3. Office Chair M14 - Unusually high inventory level (3.5x standard deviation)\n\nThese anomalies may warrant further investigation.";
    } else if (messageContent.toLowerCase().includes("recommend") || messageContent.toLowerCase().includes("suggest") || messageContent.toLowerCase().includes("advice")) {
      response = "Based on this inventory data, here are my recommendations:\n\n1. Restock Wireless Earbuds and Smart Watches immediately (currently below optimal levels)\n2. Consider discounting Office Chair inventory to reduce excess stock\n3. Reevaluate your Ultra Laptop pricing strategy as they're significantly above market average\n4. Implement more consistent restocking for Designer T-shirts to avoid stockouts\n5. Consolidate suppliers for Food items to improve procurement efficiency";
    } else {
      response = "I've analyzed the inventory data and noticed several interesting patterns. Your electronics category has the highest total value while clothing has the highest number of items. There appears to be some seasonality in your stock levels, with higher inventory towards Q1. 23% of your products are currently marked as 'Low Stock' which may require attention.";
    }
    
    // Create the final assistant response
    const assistantResponse: Message = {
      id: `assistant-${Date.now()}`,
      content: response,
      type: "assistant",
      timestamp: new Date(),
      attachments: attachments
    };
    
    // Replace the placeholder with the actual response
    setMessages(prev => prev.map(msg => 
      msg.id === assistantPlaceholder.id ? assistantResponse : msg
    ));
    
    setIsSending(false);
    
    // Update suggestions based on the conversation
    setSuggestions([
      "Show me a visualization of this data",
      "What other insights can you find?",
      "Compare this with industry benchmarks",
      "What actions should I take based on this?",
      "Explain this in simpler terms"
    ]);
  };
  
  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Bot className="h-12 w-12 opacity-50 mb-4 text-blue-500 dark:text-blue-400" />
          <div className="h-4 w-48 rounded-md animate-pulse bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-32 rounded-md mt-2 animate-pulse bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b sticky top-0 z-10 pb-3 pt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <Link 
              href={fileDetails ? `/menu/explorer?file=${fileDetails.id}` : "/menu/dashboard"}
              className="mr-3 p-2 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              <div>
                <h1 className="font-medium text-gray-800 dark:text-gray-200">
                  {fileDetails?.name || "Chat"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI-powered analysis assistant
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Share className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Messages */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-4 py-3 space-y-5 bg-gray-50 dark:bg-gray-950"
      >
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center my-8"
          >
            <div className="inline-flex rounded-full p-3 mb-3 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
              AI Data Analysis
            </h2>
            <p className="mb-6 max-w-md mx-auto text-gray-500 dark:text-gray-400">
              Ask questions about your data to get insights, visualizations, and recommendations.
            </p>
          </motion.div>
        )}
        
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={
                message.type === 'user' 
                  ? "relative max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-blue-500 text-white rounded-tr-none"
                  : message.type === 'system'
                    ? "relative max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : "relative max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm rounded-tl-none text-gray-800 dark:text-gray-200"
              }
            >
              <div className="flex items-center mb-1.5">
                {message.type === 'user' ? (
                  <div className="flex items-center">
                    <div className="bg-blue-600 p-1 rounded-full absolute -right-1 -top-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-100">You</span>
                  </div>
                ) : message.type === 'assistant' ? (
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-1 rounded-full absolute -left-1 -top-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      AI Assistant
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      System
                    </span>
                  </div>
                )}
                <span className="text-[10px] ml-2 opacity-50">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {message.loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-gray-500 dark:text-gray-400">Generating response...</span>
                </div>
              ) : (
                <div>
                  <div className="whitespace-pre-line">{message.content}</div>
                  
                  {message.attachments && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                          {attachment.type === 'chart' || attachment.type === 'image' ? (
                            <div className="space-y-2">
                              <img 
                                src={attachment.preview || "https://placehold.co/400x300"} 
                                alt="Chart preview" 
                                className="w-full h-auto max-h-60 object-cover"
                              />
                              <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800">
                                <button className="text-xs px-2 py-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700">
                                  View full screen
                                </button>
                                <button className="text-xs px-2 py-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700">
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800">
                              <FileSpreadsheet className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm">{attachment.name || "Attachment"}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Initial suggestions */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <p className="text-xs mb-3 ml-1 text-gray-500 dark:text-gray-400">
              Try asking
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-start border text-gray-700 dark:text-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSend(suggestion)}
                >
                  <LightbulbIcon className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Follow-up suggestions */}
        {messages.length > 2 && !isSending && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 px-2"
          >
            <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">
              Suggestions
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-left px-3 py-1.5 rounded-full text-sm flex-shrink-0 transition-colors bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Input area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t px-4 py-3 sticky bottom-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-2 relative">
          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question about your data..."
              className="w-full border rounded-lg pl-3 pr-10 py-3 max-h-32 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              rows={1}
            />
          </div>
          
          <button 
            onClick={() => handleSend()}
            disabled={isSending || !input.trim()}
            className={
              input.trim() 
                ? "p-2 rounded-full transition-colors bg-blue-500 text-white hover:bg-blue-600" 
                : "p-2 rounded-full transition-colors bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="flex justify-between mt-2 px-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button className="hover:text-foreground">
              <Image className="h-3.5 w-3.5 inline mr-1" />
              Upload
            </button>
            <button className="hover:text-foreground">
              <Mic className="h-3.5 w-3.5 inline mr-1" />
              Voice
            </button>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-600">
            Powered by AI
          </div>
        </div>
      </motion.div>
      
      {/* New chat button */}
      <div className="fixed bottom-6 right-6">
      <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">New Chat</span>
        </motion.button>
      </div>
    </div>
  );
}