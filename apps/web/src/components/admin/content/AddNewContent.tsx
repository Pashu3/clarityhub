"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Image as ImageIcon, 
  BookOpen, 
  FileCode, 
  MessageSquare, 
  Video,
  Upload,
  Calendar,
  Tag,
  User,
  Info,
  AlertCircle
} from "lucide-react";

interface AddNewContentProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contentData: any) => void;
}

export default function AddNewContent({ isOpen, onClose, onSave }: AddNewContentProps) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Draft');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Content type options
  const contentTypes = [
    { id: 'guide', name: 'Guide', icon: BookOpen, description: 'In-depth instructional content explaining concepts or processes' },
    { id: 'tutorial', name: 'Tutorial', icon: Video, description: 'Step-by-step instructions to help users accomplish specific tasks' },
    { id: 'documentation', name: 'Documentation', icon: FileCode, description: 'Technical reference material for your product or API' },
    { id: 'faq', name: 'FAQ', icon: MessageSquare, description: 'Frequently asked questions and their answers' }
  ];

  // Reset form when modal closes
  const handleClose = () => {
    setStep('type');
    setSelectedType(null);
    setTitle('');
    setCategory('');
    setContent('');
    setStatus('Draft');
    setImage(null);
    setImagePreview(null);
    setFormError(null);
    onClose();
  };

  // Handle type selection
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep('details');
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setFormError('Please enter a title');
      return;
    }
    
    if (!category.trim()) {
      setFormError('Please select a category');
      return;
    }
    
    if (!content.trim()) {
      setFormError('Please add some content');
      return;
    }
    
    // Create new content object
    const contentTypeName = contentTypes.find(type => type.id === selectedType)?.name || '';
    const newContent = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      type: contentTypeName,
      status,
      category,
      content,
      author: 'Current User',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      views: 0,
      readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min`,
      image: imagePreview
    };
    
    // Save the content
    onSave(newContent);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div 
              className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {step === 'type' ? 'Create New Content' : `New ${contentTypes.find(type => type.id === selectedType)?.name}`}
                </h2>
                <button 
                  onClick={handleClose}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {step === 'type' ? (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Select the type of content you want to create:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contentTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          className={`p-4 border rounded-xl text-left flex items-start hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors ${
                            selectedType === type.id 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500' 
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                          onClick={() => handleTypeSelect(type.id)}
                          whileHover={{ y: -4 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
                            <type.icon size={24} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white mb-1">{type.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{type.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {formError && (
                      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        {formError}
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Title
                        </label>
                        <input 
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a descriptive title"
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Category
                        </label>
                        <div className="relative">
                          <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option value="">Select a category</option>
                            <option value="Onboarding">Onboarding</option>
                            <option value="Features">Features</option>
                            <option value="Support">Support</option>
                            <option value="Account">Account</option>
                            <option value="Integrations">Integrations</option>
                            <option value="Security">Security</option>
                            <option value="Billing">Billing</option>
                            <option value="Data Management">Data Management</option>
                          </select>
                          <Tag size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <div className="relative">
                          <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Published">Published</option>
                          </select>
                          <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Content
                        </label>
                        <textarea 
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Add the content here..."
                          rows={8}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                      </div>
                      
                      {/* Featured Image */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Featured Image
                        </label>
                        {imagePreview ? (
                          <div className="relative rounded-lg overflow-hidden h-48 mb-2">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-600"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                              <ImageIcon size={24} className="text-slate-500 dark:text-slate-400" />
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Upload an image</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Drag and drop or click to browse
                            </p>
                            <input 
                              id="image-upload"
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                {step === 'type' ? (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setStep('type')}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      Back
                    </button>
                    <div className="space-x-3">
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Create Content
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}