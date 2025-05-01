"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ChevronDown, 
  Search, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  Clock, 
  Users, 
  Check, 
  X, 
  Filter,
  Bookmark,
  Star,
  AlertCircle,
  Loader2,
  UserPlus
} from "lucide-react";

// Mock data for shared chats
const MOCK_SHARED_CHATS = [
  {
    id: "chat-1",
    title: "Q2 Marketing Strategy Discussion",
    snippet: "Let's review the latest campaign metrics and adjust our approach for next quarter...",
    sharedBy: {
      name: "Elena Richardson",
      email: "elena@example.com",
      avatar: "/avatars/elena.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Michael Chen", email: "michael@example.com", avatar: "/avatars/michael.jpg" },
      { name: "Sarah Johnson", email: "sarah@example.com", avatar: "/avatars/sarah.jpg" }
    ],
    lastActivity: "2025-04-24T14:32:00Z",
    status: "active",
    pinned: true,
    unread: false
  },
  {
    id: "chat-2",
    title: "Product Feature Prioritization",
    snippet: "We need to decide which features to prioritize for the next sprint based on user feedback and metrics...",
    sharedBy: {
      name: "David Park",
      email: "david@example.com",
      avatar: "/avatars/david.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Emma Watson", email: "emma@example.com", avatar: "/avatars/emma.jpg" }
    ],
    lastActivity: "2025-04-25T09:15:00Z",
    status: "active",
    pinned: false,
    unread: true
  },
  {
    id: "chat-3",
    title: "Customer Feedback Analysis",
    snippet: "I've compiled the latest customer feedback from our NPS survey. Let's discuss the key insights and action items...",
    sharedBy: {
      name: "Sophia Martinez",
      email: "sophia@example.com",
      avatar: "/avatars/sophia.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Team Leaders", email: "team-leads@example.com", avatar: null }
    ],
    lastActivity: "2025-04-23T16:45:00Z",
    status: "active",
    pinned: true,
    unread: false
  },
  {
    id: "chat-4",
    title: "Website Redesign Feedback",
    snippet: "Here are my thoughts on the new homepage mockups. I think we should consider adjusting the hero section...",
    sharedBy: {
      name: "Jason Kim",
      email: "jason@example.com",
      avatar: "/avatars/jason.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Design Team", email: "design@example.com", avatar: null }
    ],
    lastActivity: "2025-04-22T11:20:00Z",
    status: "archived",
    pinned: false,
    unread: false
  },
  {
    id: "chat-5",
    title: "Content Calendar for May",
    snippet: "I've drafted the content calendar for next month. Please review and let me know if you have any suggestions...",
    sharedBy: {
      name: "Olivia Williams",
      email: "olivia@example.com",
      avatar: "/avatars/olivia.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Marketing Team", email: "marketing@example.com", avatar: null }
    ],
    lastActivity: "2025-04-21T13:10:00Z",
    status: "active",
    pinned: false,
    unread: true
  },
  {
    id: "chat-6",
    title: "Budget Planning for Q3",
    snippet: "Based on our Q2 performance, here's the initial budget allocation proposal for Q3...",
    sharedBy: {
      name: "Robert Johnson",
      email: "robert@example.com",
      avatar: "/avatars/robert.jpg"
    },
    sharedWith: [
      { name: "You", email: "alex@example.com", avatar: null },
      { name: "Finance Team", email: "finance@example.com", avatar: null },
      { name: "Department Heads", email: "dept-heads@example.com", avatar: null }
    ],
    lastActivity: "2025-04-19T15:30:00Z",
    status: "active",
    pinned: false,
    unread: false
  }
];

// Type definition for a shared chat
type SharedChat = typeof MOCK_SHARED_CHATS[0];

export default function SharedChats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedChats, setSharedChats] = useState<SharedChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<SharedChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SharedChat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pinned, unread, archived
  const [sortBy, setSortBy] = useState("recent"); // recent, name
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch shared chats
  useEffect(() => {
    const fetchSharedChats = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setSharedChats(MOCK_SHARED_CHATS);
      } catch (error) {
        console.error("Error fetching shared chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedChats();
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...sharedChats];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        chat => 
          chat.title.toLowerCase().includes(query) || 
          chat.snippet.toLowerCase().includes(query) ||
          chat.sharedBy.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filter === "pinned") {
      result = result.filter(chat => chat.pinned);
    } else if (filter === "unread") {
      result = result.filter(chat => chat.unread);
    } else if (filter === "archived") {
      result = result.filter(chat => chat.status === "archived");
    } else if (filter === "active") {
      result = result.filter(chat => chat.status === "active");
    }

    // Apply sorting
    if (sortBy === "recent") {
      result = result.sort((a, b) => 
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );
    } else if (sortBy === "name") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredChats(result);
  }, [sharedChats, searchQuery, filter, sortBy]);

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Toggle pin status
  const togglePin = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSharedChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  // Mark chat as read
  const markAsRead = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSharedChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, unread: false } : chat
      )
    );
  };

  // Archive a chat
  const archiveChat = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSharedChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, status: chat.status === "archived" ? "active" : "archived" } : chat
      )
    );
  };

  // Show chat details
  const showChatDetails = (chat: SharedChat) => {
    setSelectedChat(chat);
  };

  // Close chat details
  const closeChatDetails = () => {
    setSelectedChat(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Render the Avatar component
  const Avatar = ({ name, avatar }: { name: string, avatar: string | null }) => {
    if (avatar) {
      return (
        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </div>
      );
    }

    // Generate initials from name
    const initials = name.split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 text-sm font-medium">
        {initials}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading shared chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md mb-6"
      >
        <h1 className="text-2xl font-bold">Shared Chats</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Access and manage conversations that have been shared with you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-auto flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search shared chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setFilter("all");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left block px-4 py-2 text-sm ${
                        filter === "all"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      All Chats
                    </button>
                    <button
                      onClick={() => {
                        setFilter("active");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left block px-4 py-2 text-sm ${
                        filter === "active"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Active Chats
                    </button>
                    <button
                      onClick={() => {
                        setFilter("pinned");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left block px-4 py-2 text-sm ${
                        filter === "pinned"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Pinned Chats
                    </button>
                    <button
                      onClick={() => {
                        setFilter("unread");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left block px-4 py-2 text-sm ${
                        filter === "unread"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Unread Chats
                    </button>
                    <button
                      onClick={() => {
                        setFilter("archived");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left block px-4 py-2 text-sm ${
                        filter === "archived"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Archived Chats
                    </button>
                  </div>
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Shared chats list */}
        {filteredChats.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No shared chats found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery 
                ? "We couldn't find any shared chats matching your search criteria. Try adjusting your filters or search terms."
                : filter !== "all" 
                  ? "No chats match the current filter. Try a different filter option."
                  : "When someone shares a chat with you, it will appear here. Start by sharing one of your chats with a teammate."}
            </p>
            {!searchQuery && filter === "all" && (
              <button className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team Members
              </button>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                variants={itemVariants}
                onClick={() => showChatDetails(chat)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md relative border-l-4 ${
                  chat.status === "archived"
                    ? "border-gray-300 dark:border-gray-700"
                    : chat.unread
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                {chat.pinned && (
                  <div className="absolute -left-2 top-3">
                    <div className="bg-amber-500 h-4 w-4 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className={`font-medium ${chat.unread ? "font-semibold" : ""}`}>{chat.title}</h3>
                      {chat.unread && (
                        <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{chat.snippet}</p>
                    <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDateTime(chat.lastActivity)}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Shared with {chat.sharedWith.length} {chat.sharedWith.length === 1 ? 'person' : 'people'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="flex items-center">
                      <button
                        onClick={(e) => togglePin(chat.id, e)}
                        className={`p-1.5 rounded-full ${
                          chat.pinned ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        title={chat.pinned ? "Unpin chat" : "Pin chat"}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      {chat.unread && (
                        <button
                          onClick={(e) => markAsRead(chat.id, e)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => archiveChat(chat.id, e)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        title={chat.status === "archived" ? "Unarchive chat" : "Archive chat"}
                      >
                        {chat.status === "archived" ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        <Avatar name={chat.sharedBy.name} avatar={chat.sharedBy.avatar} />
                        {chat.sharedWith.slice(0, 2).map((person, idx) => (
                          <div key={idx} className="ring-2 ring-white dark:ring-gray-800">
                            <Avatar name={person.name} avatar={person.avatar} />
                          </div>
                        ))}
                        {chat.sharedWith.length > 2 && (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                            +{chat.sharedWith.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Chat Details Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">{selectedChat.title}</h2>
                <button
                  onClick={closeChatDetails}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Shared by</h3>
                  <div className="flex items-center gap-3">
                    <Avatar name={selectedChat.sharedBy.name} avatar={selectedChat.sharedBy.avatar} />
                    <div>
                      <p className="font-medium">{selectedChat.sharedBy.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChat.sharedBy.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Shared with</h3>
                  <div className="space-y-3">
                    {selectedChat.sharedWith.map((person, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar name={person.name} avatar={person.avatar} />
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{person.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <p className="text-sm">{selectedChat.snippet}</p>
                  </div>
                </div>

                <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                  <div className="flex text-sm text-gray-500 dark:text-gray-400 justify-between">
                    <div>
                      <p>Last activity: {formatDateTime(selectedChat.lastActivity)}</p>
                      <p>Status: <span className="capitalize">{selectedChat.status}</span></p>
                    </div>
                    <div className="flex gap-2">
                      {selectedChat.pinned && <div className="flex items-center"><Bookmark className="h-4 w-4 text-amber-500 mr-1" /> Pinned</div>}
                      {selectedChat.unread && <div className="flex items-center"><AlertCircle className="h-4 w-4 text-blue-500 mr-1" /> Unread</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button 
                  onClick={closeChatDetails}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <Link 
                  href={`/chats/${selectedChat.id}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Chat
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}