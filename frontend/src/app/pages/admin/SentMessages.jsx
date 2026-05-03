import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Send, Clock, User, Users, Mail, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { api } from '../../../app/lib/api';
import { toast } from 'sonner';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function SentMessages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const isRTL = i18n.language === 'ar';

  // Load data from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.messages.getSent();
      
      console.log("📤 Sent messages response:", response);
      
      // Handle different response structures
      let messagesData = [];
      if (response?.success && response?.data) {
        messagesData = response.data;
      } else if (Array.isArray(response)) {
        messagesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        messagesData = response.data;
      }
      
      // Format messages with additional fields
      const formattedMessages = messagesData.map(msg => ({
        ...msg,
        receiverName: msg.receiverName || msg.receiver?.fullName || msg.receiver?.name || t('unknown'),
        receiverRole: msg.receiverRole || msg.receiver?.role || 'User',
        timeAgo: formatTimeAgo(msg.createdAt || msg.sentDate || msg.createdDate),
        formattedDate: formatDate(msg.createdAt || msg.sentDate || msg.createdDate)
      }));
      
      setMessages(formattedMessages);
      
    } catch (err) {
      console.error("Error fetching sent messages:", err);
      toast.error(t('errorLoadingMessages') || 'Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
    toast.success(t('messagesRefreshed') || 'Messages refreshed');
  };

  const handleDelete = async (messageId, e) => {
    e.stopPropagation();
    
    if (window.confirm(t('confirmDelete') || 'Are you sure you want to delete this message?')) {
      try {
        const success = await api.messages.delete(messageId);
        if (success) {
          toast.success(t('messageDeleted') || 'Message deleted successfully');
          setMessages(prev => prev.filter(m => m.oid !== messageId));
          if (selectedMessage?.oid === messageId) {
            setSelectedMessage(null);
          }
        } else {
          toast.error(t('deleteFailed') || 'Failed to delete message');
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error(t('deleteFailed') || 'Failed to delete message');
      }
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // You can also navigate to a detailed view
    // navigate(`/admin/messages/sent/${message.oid}`);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return t('unknown');
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('justNow') || 'Just now';
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo') || 'minutes ago'}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo') || 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo') || 'days ago'}`;
    return formatDate(dateString);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(msg =>
    (msg.receiverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon based on message type
  const getMessageIcon = (message) => {
    if (message.isGroupMessage) {
      return <Users className="h-5 w-5 text-purple-500" />;
    }
    return <User className="h-5 w-5 text-blue-500" />;
  };

  if (loading) {
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/messages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('sentMessages') || 'Sent Messages'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t('sentMessagesDesc') || 'Messages you have sent'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh') || 'Refresh'}
          </Button>

          <Button
            onClick={() => navigate('/admin/messages/new')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Send className="h-4 w-4" />
            {t('newMessage') || 'New Message'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('totalSent') || 'Total Sent'}</p>
                <p className="text-2xl font-bold text-purple-600">{messages.length}</p>
              </div>
              <Send className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('groupMessages') || 'Group Messages'}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {messages.filter(m => m.isGroupMessage).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('individualMessages') || 'Individual Messages'}</p>
                <p className="text-2xl font-bold text-green-600">
                  {messages.filter(m => !m.isGroupMessage).length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
            <Input
              type="text"
              placeholder={t('searchMessages') || 'Search by recipient, subject, or content...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchTerm ? t('noMatchingMessages') || 'No matching messages' : t('noSentMessages') || 'No sent messages'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? (t('tryDifferentSearch') || 'Try a different search term')
                  : (t('startMessaging') || 'Start sending messages to see them here')}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/admin/messages/new')}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t('composeMessage') || 'Compose Message'}
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.oid}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                    selectedMessage?.oid === msg.oid ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                  onClick={() => handleViewMessage(msg)}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header with receiver info */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getMessageIcon(msg)}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t('to')}: {msg.receiverName}
                        </h3>
                        
                        {msg.isGroupMessage && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {t('group') || 'Group'}
                          </Badge>
                        )}
                        
                        {msg.receiverRole && !msg.isGroupMessage && (
                          <Badge variant="outline" className="text-xs">
                            {msg.receiverRole}
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="text-xs">
                          {msg.isRead ? (t('read') || 'Read') : (t('sent') || 'Sent')}
                        </Badge>
                      </div>

                      {/* Subject */}
                      <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {msg.subject}
                      </p>

                      {/* Message preview */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {msg.content}
                      </p>

                      {/* Target role for group messages */}
                      {msg.isGroupMessage && msg.targetRole && (
                        <p className="text-xs text-gray-400 mt-1">
                          {t('target')}: {msg.targetRole}
                        </p>
                      )}
                    </div>

                    {/* Time and Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center text-sm text-gray-500 gap-2">
                        <Clock className="h-4 w-4" />
                        <span title={msg.formattedDate}>{msg.timeAgo}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(msg);
                          }}
                          className="h-8 w-8 p-0"
                          title={t('viewDetails') || 'View details'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(msg.oid, e)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title={t('delete') || 'Delete'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Details Modal/View */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('messageDetails') || 'Message Details'}</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('to') || 'To'}:</label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.receiverName}</p>
              </div>
              
              {selectedMessage.isGroupMessage && (
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('targetRole') || 'Target Role'}:</label>
                  <p className="text-gray-900 dark:text-white">{selectedMessage.targetRole}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('subject') || 'Subject'}:</label>
                <p className="text-gray-900 dark:text-white font-medium">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('date') || 'Date'}:</label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.formattedDate}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('message') || 'Message'}:</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {filteredMessages.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {t('showing') || 'Showing'} {filteredMessages.length} {t('of') || 'of'} {messages.length} {t('messages') || 'messages'}
        </div>
      )}
    </div>
  );
}