export interface SharedChatUser {
  id: string;
  userId: string;
  sharedChatId: string;
  readAt?: Date;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SharedChat {
  id: string;
  title: string;
  previewText: string;
  aiQueryId: string;
  isBookmarked: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  sharedBy: string;
  sharedWith: SharedChatUser[]; // Make sure this exists
  aiQuery: {             // Make sure this exists
    id: string;
    question: string;
    response: string;
    fileId: string;
    userId?: string;
  } | null;
}

// Interface for response to clients
export interface SharedChatResponse {
  id: string;
  title: string;
  previewText: string;
  aiQueryId: string;
  isBookmarked: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  sharedBy: string;
  aiQuery: {
    id: string;
    question: string;
    response: string;
    fileId: string;
  };
}