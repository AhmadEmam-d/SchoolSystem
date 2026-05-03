import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Send, Inbox, Archive, Search, User, 
  Trash2, Check, X, Reply, Star, Clock, 
  Paperclip, Smile, MoreVertical, RefreshCw,
  MessageSquare, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminMessages() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [summary, setSummary] = useState({ unreadCount: 0, totalMessages: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
 // const [showCompose, setShowCompose] = useState(false);
  
  // Compose form state
  const [composeForm, setComposeForm] = useState({
    receiverId: '',
    subject: '',
    body: ''
  });
  const [users, setUsers] = useState([]);
  
  const messagesEndRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
    fetchUsers();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (selectedMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMessage]);

  const fetchUsers = async () => {
    try {
      const teachers = await api.teachers?.getAll() || [];
      const students = await api.students?.getAll() || [];
      setUsers([...teachers, ...students]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary
      const summaryData = await api.messages.getSummary();
      setSummary(summaryData);
      
      // Fetch conversations
      const conversationsData = await api.messages.getConversations();
      setConversations(conversationsData);
      
      // Fetch messages based on active tab
      await fetchMessagesByTab(activeTab);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(t('errorFetchingMessages'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesByTab = async (tab) => {
    try {
      let data = [];
      if (tab === 'inbox') {
        data = await api.messages.getInbox();
      } else if (tab === 'sent') {
        data = await api.messages.getSent();
      }
      setMessages(data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${tab} messages:`, error);
      return [];
    }
  };

  const handleTabChange = async (value) => {
    setActiveTab(value);
    setSelectedMessage(null);
    setLoading(true);
    await fetchMessagesByTab(value);
    setLoading(false);
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's in inbox and not read
    if (activeTab === 'inbox' && !message.isRead) {
      try {
        await api.messages.markAsRead(message.oid);
        // Update local state
        message.isRead = true;
        setSummary(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
        await fetchMessagesByTab('inbox');
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleDeleteMessage = async (messageId, e) => {
    e.stopPropagation();
    
    if (window.confirm(t('confirmDeleteMessage'))) {
      try {
        const success = await api.messages.delete(messageId);
        if (success) {
          toast.success(t('messageDeleted'));
          // Refresh current tab messages
          await fetchMessagesByTab(activeTab);
          if (selectedMessage?.oid === messageId) {
            setSelectedMessage(null);
          }
        } else {
          toast.error(t('deleteFailed'));
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error(t('deleteFailed'));
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!composeForm.receiverId) {
      toast.error(t('selectRecipient'));
      return;
    }
    if (!composeForm.subject.trim()) {
      toast.error(t('enterSubject'));
      return;
    }
    if (!composeForm.body.trim()) {
      toast.error(t('enterMessage'));
      return;
    }
    
    setSending(true);
    try {
      const result = await api.messages.send({
        receiverId: composeForm.receiverId,
        subject: composeForm.subject,
        body: composeForm.body
      });
      
      if (result.success) {
        toast.success(t('messageSent'));
       // setShowCompose(false);
      //  setComposeForm({ receiverId: '', subject: '', body: '' });
        // Refresh sent messages
        if (activeTab === 'sent') {
          await fetchMessagesByTab('sent');
        }
        // Refresh conversations
        const conversationsData = await api.messages.getConversations();
        setConversations(conversationsData);
      } else {
        toast.error(result.error || t('sendFailed'));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error(t('enterReply'));
      return;
    }
    
    setSending(true);
    try {
      const result = await api.messages.send({
        receiverId: selectedMessage.senderId,
        subject: `Re: ${selectedMessage.subject}`,
        body: replyText
      });
      
      if (result.success) {
        toast.success(t('replySent'));
        setReplyText('');
        // Refresh conversation
        await fetchMessagesByTab('inbox');
      } else {
        toast.error(result.error || t('sendFailed'));
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(t('sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const handleRefresh = async () => {
    await fetchAllData();
    toast.success(t('messagesRefreshed'));
  };

  const getRecipientName = (message) => {
    if (activeTab === 'inbox') {
      return message.senderName || message.sender?.fullName || t('unknown');
    } else {
      return message.receiverName || message.receiver?.fullName || t('unknown');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
    return date.toLocaleDateString();
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.body?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getRecipientName(msg).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loadingMessages') || 'Loading messages...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('messages') || 'Messages'}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('messagesDesc') || 'Manage your communications'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t('refresh') || 'Refresh'}
          </Button>
          
          
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{t('unreadMessages') || 'Unread Messages'}</p>
                <p className="text-3xl font-bold">{summary.unreadCount || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{t('totalMessages') || 'Total Messages'}</p>
                <p className="text-3xl font-bold">{summary.totalMessages || messages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">{t('conversations') || 'Conversations'}</p>
                <p className="text-3xl font-bold">{conversations.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">{t('sentMessages') || 'Sent Messages'}</p>
                <p className="text-3xl font-bold">{activeTab === 'sent' ? messages.length : '-'}</p>
              </div>
              <Send className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations/Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('conversations') || 'Conversations'}</span>
                <Badge variant="outline">{conversations.length}</Badge>
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchMessages') || 'Search messages...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 mx-4 mb-4">
                  <TabsTrigger value="inbox" className="flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    {t('inbox') || 'Inbox'}
                    {summary.unreadCount > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white">{summary.unreadCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {t('sent') || 'Sent'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="m-0">
                  <div className="divide-y">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>{t('noMessages') || 'No messages'}</p>
                      </div>
                    ) : (
                      filteredMessages.map(message => (
                        <div
                          key={message.oid}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage?.oid === message.oid ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                          } ${!message.isRead ? 'bg-blue-50' : ''}`}
                          onClick={() => handleMessageClick(message)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <p className="font-semibold text-gray-900 truncate">
                                  {message.subject}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {t('from') || 'From'}: {message.senderName || message.sender?.fullName}
                              </p>
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {message.body?.substring(0, 60)}...
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDate(message.createdAt || message.sentDate)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteMessage(message.oid, e)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sent" className="m-0">
                  <div className="divide-y">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Send className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>{t('noSentMessages') || 'No sent messages'}</p>
                      </div>
                    ) : (
                      filteredMessages.map(message => (
                        <div
                          key={message.oid}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage?.oid === message.oid ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                          }`}
                          onClick={() => handleMessageClick(message)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {message.subject}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {t('to') || 'To'}: {message.receiverName || message.receiver?.fullName}
                              </p>
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {message.body?.substring(0, 60)}...
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDate(message.createdAt || message.sentDate)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteMessage(message.oid, e)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          {activeTab === 'inbox' 
                            ? `${t('from') || 'From'}: ${selectedMessage.senderName || selectedMessage.sender?.fullName}`
                            : `${t('to') || 'To'}: ${selectedMessage.receiverName || selectedMessage.receiver?.fullName}`
                          }
                        </span>
                        <span>
                          {formatDate(selectedMessage.createdAt || selectedMessage.sentDate)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteMessage(selectedMessage.oid, e)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
                  </div>
                  
                  {activeTab === 'inbox' && (
                    <div className="mt-6 pt-6 border-t">
                      <label className="block text-sm font-medium mb-2">
                        {t('reply') || 'Reply'}
                      </label>
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t('writeReply') || 'Write your reply...'}
                        rows={4}
                        className="mb-3"
                      />
                      <Button 
                        onClick={handleReply} 
                        disabled={sending}
                        className="flex items-center gap-2"
                      >
                        {sending ? t('sending') || 'Sending...' : t('sendReply') || 'Send Reply'}
                        <Reply className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                <Mail className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {t('selectMessage') || 'Select a message'}
                </h3>
                <p className="text-gray-500">
                  {t('selectMessageDesc') || 'Choose a message from the list to view its contents'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}