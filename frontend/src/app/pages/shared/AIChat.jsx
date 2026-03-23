import React, { useState, useRef } from 'react';
import { Send, Bot, User, Trash2, Download, AlertCircle, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

export function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am SmartTutor AI. How can I help you with your schoolwork or teaching today? You can also upload images and files to get help analyzing them!',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = [];
    
    Array.from(files).forEach((file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      
      newAttachments.push({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: url,
      });
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input || '📎 Sent files',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "I'm a simulated AI response. In a real application, I would connect to an LLM to provide helpful answers based on your school data.";
      
      if (userMsg.attachments && userMsg.attachments.length > 0) {
        const hasImages = userMsg.attachments.some(a => a.type.startsWith('image/'));
        const hasPDFs = userMsg.attachments.some(a => a.type.includes('pdf'));
        
        if (hasImages) {
          responseContent = "I can see you've uploaded images! In a production environment, I would analyze these images using vision AI to help you with:\n\n• Math problem solving from handwritten or printed equations\n• Diagram analysis and explanations\n• Text extraction and translation\n• Homework assistance\n\nWhat would you like to know about these images?";
        } else if (hasPDFs) {
          responseContent = "I've received your PDF files! In a real implementation, I would:\n\n• Extract and analyze the text content\n• Answer questions about the document\n• Summarize key points\n• Help with homework or study materials\n\nWhat specific questions do you have about these documents?";
        } else {
          responseContent = "I've received your files! In a production system, I would analyze them and provide relevant assistance based on the content. How can I help you with these files?";
        }
      }
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    // Clean up attachment URLs
    messages.forEach(msg => {
      msg.attachments?.forEach(att => {
        URL.revokeObjectURL(att.url);
      });
    });
    
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat cleared. How can I help you now?',
        timestamp: new Date(),
      }
    ]);
    setAttachments([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600" />
            SmartTutor AI
          </h1>
          <p className="text-sm text-gray-500">Your personal educational assistant • Upload images & files for analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert('Exporting chat...')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-gray-200 shadow-sm">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    
                    {/* Display attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((attachment) => {
                          const isImage = attachment.type.startsWith('image/');
                          const FileIconComponent = getFileIcon(attachment.type);
                          
                          return (
                            <div key={attachment.id}>
                              {isImage ? (
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name}
                                  className="max-w-full rounded-lg border border-gray-200 max-h-64 object-contain"
                                />
                              ) : (
                                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                  msg.role === 'user' ? 'bg-indigo-700' : 'bg-gray-50'
                                }`}>
                                  <FileIconComponent className="h-4 w-4" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                                    <p className="text-[10px] opacity-70">{formatFileSize(attachment.size)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        <div className="p-4 bg-white border-t border-gray-200">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => {
                const isImage = attachment.type.startsWith('image/');
                const FileIconComponent = getFileIcon(attachment.type);
                
                return (
                  <div key={attachment.id} className="relative group">
                    {isImage ? (
                      <div className="relative">
                        <img 
                          src={attachment.url} 
                          alt={attachment.name}
                          className="h-16 w-16 object-cover rounded-lg border-2 border-indigo-200"
                        />
                        <button
                          onClick={() => removeAttachment(attachment.id)}
                          className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pl-3 pr-8 py-2 bg-gray-100 rounded-lg border border-gray-200 relative">
                        <FileIconComponent className="h-4 w-4 text-gray-600" />
                        <div className="max-w-[120px]">
                          <p className="text-xs font-medium text-gray-700 truncate">{attachment.name}</p>
                          <p className="text-[10px] text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                        <button
                          onClick={() => removeAttachment(attachment.id)}
                          className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              type="button"
              size="icon" 
              variant="outline"
              className="rounded-full h-10 w-10 shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or attach files..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={isLoading || (!input.trim() && attachments.length === 0)}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              📎 Supports: Images, PDFs, Documents (Max 10MB per file)
            </p>
            <p className="text-xs text-gray-400">
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
