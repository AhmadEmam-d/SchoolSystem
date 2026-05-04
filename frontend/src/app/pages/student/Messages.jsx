import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Send, Search, MoreVertical, Paperclip, Inbox, Mail, CheckCircle, Clock, Edit } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { api } from '../../lib/api';

// أيقونات مخصصة (اختيارية - يمكنك استخدام lucide-react بدلاً من ذلك)
const IconCompose = () => <Edit className="h-4 w-4" />;

export function StudentMessages() {
  const navigate = useNavigate(); // ⚠️ أضف هذا السطر
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', content: '' });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser && !messages[selectedUser]) {
      fetchMessagesForUser(selectedUser);
    }
  }, [selectedUser]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchSummary(),
      fetchConversations(),
      fetchAllMessages(),
    ]);
    setLoading(false);
  };

  const fetchSummary = async () => {
    try {
      const data = await api.messages.getSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await api.messages.getConversations();
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchAllMessages = async () => {
    try {
      const [inbox, sent] = await Promise.all([
        api.messages.getInbox(),
        api.messages.getSent(),
      ]);

      const inboxMsgs = (inbox || []).map(m => ({ ...m, _dir: 'received' }));
      const sentMsgs = (sent || []).map(m => ({ ...m, _dir: 'sent' }));

      // Group by the "other" person
      const grouped = {};
      [...inboxMsgs, ...sentMsgs].forEach(msg => {
        const other = msg.senderOid === user.oid ? msg.receiverOid : msg.senderOid;
        if (!grouped[other]) grouped[other] = [];
        if (!grouped[other].find(x => x.oid === msg.oid)) grouped[other].push(msg);
      });

      // Sort messages in each conversation
      Object.keys(grouped).forEach(k => {
        grouped[k].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      });

      setMessages(grouped);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchMessagesForUser = async (userOid) => {
    // If we already have messages for this user from fetchAllMessages, skip
    if (messages[userOid]) return;

    try {
      const [inbox, sent] = await Promise.all([
        api.messages.getInbox(),
        api.messages.getSent(),
      ]);

      const allMsgs = [...(inbox || []), ...(sent || [])];
      const userMsgs = allMsgs.filter(msg =>
        msg.senderOid === userOid || msg.receiverOid === userOid
      ).map(msg => ({
        ...msg,
        _dir: msg.senderOid === user.oid ? 'sent' : 'received'
      }));

      userMsgs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      setMessages(prev => ({ ...prev, [userOid]: userMsgs }));
    } catch (error) {
      console.error('Error fetching messages for user:', error);
    }
  };

  const markAsRead = async (userOid) => {
    const conv = conversations.find(c => c.userOid === userOid);
    const prevUnread = conv?.unreadCount || 0;
    if (prevUnread === 0) return;

    // Optimistic UI update
    setConversations(prev =>
      prev.map(c => c.userOid === userOid ? { ...c, unreadCount: 0 } : c)
    );
    setSummary(prev => prev ? {
      ...prev,
      unreadCount: Math.max(0, (prev.unreadCount || 0) - prevUnread)
    } : prev);

    // Find and mark all unread messages as read
    const convMsgs = messages[userOid] || [];
    const unreadMsgs = convMsgs.filter(m =>
      (m._dir === 'received' || m.senderOid !== user.oid) && !m.isRead
    );

    await Promise.allSettled(
      unreadMsgs.map(msg => api.messages.markAsRead(msg.oid))
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.to.trim() || !newMessage.content.trim()) return;

    setSending(true);
    try {
      const result = await api.messages.send({
        receiverOid: newMessage.to,
        subject: newMessage.subject,
        content: newMessage.content,
      });

      if (result.success) {
        setShowCompose(false);
        setNewMessage({ to: '', subject: '', content: '' });
        fetchAll();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getMessagesForUser = (userOid) => {
    return messages[userOid] || [];
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchSearch = conv.userName?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'sent') {
      // Check if user has sent messages to this person
      const convMsgs = getMessagesForUser(conv.userOid);
      return convMsgs.some(m => m._dir === 'sent');
    }
    if (filter === 'received') {
      const convMsgs = getMessagesForUser(conv.userOid);
      return convMsgs.some(m => m._dir === 'received');
    }
    return true;
  });

  const currentMessages = selectedUser ? getMessagesForUser(selectedUser) : [];
  const selectedConv = conversations.find(c => c.userOid === selectedUser);

  const filterTabs = [
    { id: 'all', label: t('all'), icon: <Inbox className="h-3.5 w-3.5" /> },
    { id: 'unread', label: t('unread'), icon: null },
    { id: 'sent', label: t('sent'), icon: <Send className="h-3.5 w-3.5" /> },
    { id: 'received', label: t('received'), icon: null },
  ];

  // Helper function for role label
  const getRoleLabel = (role) => {
    if (role === 'teacher') return t('teacher');
    if (role === 'admin') return t('roleAdmin');
    return role || t('user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('messagesPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('communicateWithTeachers')}</p>
        </div>
        
        {/* زر كتابة رسالة جديدة - تم تعديل المسار */}
        <Button
          onClick={() => navigate("/student/messages/new")}  // تم تغيير المسار إلى student
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <IconCompose />
          {t('newMessage')}
        </Button>
      </div>

      {/* باقي الكود كما هو ... */}
      {/* Stats Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('totalMessages'), value: summary.totalMessages, icon: Mail, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: t('unread'), value: summary.unreadCount, icon: Clock, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
            { label: t('sent'), value: summary.sentCount, icon: Send, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
            { label: t('received'), value: summary.receivedCount, icon: Inbox, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value ?? '—'}</p>
                  </div>
                  <div className={`p-2 rounded-full ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Panel - استمرار نفس الكود */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">
        {/* LEFT: Conversation List */}
        <Card className="border-none shadow-md lg:col-span-1 dark:bg-gray-800">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <Input
                  placeholder={t('searchConversationsPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-2 gap-1 border-b dark:border-gray-700">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    filter === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="divide-y dark:divide-gray-700">
                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('noConversations')}</p>
                  </div>
                )}
                {filteredConversations.map(conv => (
                  <div
                    key={conv.userOid}
                    onClick={() => {
                      setSelectedUser(conv.userOid);
                      setSelectedMessage(null);
                      if (conv.unreadCount > 0) markAsRead(conv.userOid);
                    }}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedUser === conv.userOid
                        ? `bg-indigo-50 dark:bg-indigo-900/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-indigo-600`
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          {conv.userName?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                            {conv.userName}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conv.lastMessage}
                        </p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {getRoleLabel(conv.role)}
                        </span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* RIGHT: Messages Panel - نفس الكود */}
        <Card className="border-none shadow-md lg:col-span-2 dark:bg-gray-800">
          {selectedConv ? (
            <CardContent className="p-0 h-full flex flex-col">
              {/* Header */}
              <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      {selectedConv.userName?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {selectedConv.userName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleLabel(selectedConv.role)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {currentMessages.length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('noMessagesYet')}</p>
                      </div>
                    )}
                    {currentMessages.map(msg => {
                      const isMine = msg.senderOid === user.oid;
                      const isSelected = selectedMessage?.oid === msg.oid;
                      return (
                        <div
                          key={msg.oid}
                          onClick={() => setSelectedMessage(isSelected ? null : msg)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  isMine
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {isMine ? t('sent') : t('received')}
                                </span>
                                {msg.subject && (
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {msg.subject}
                                  </span>
                                )}
                                {!msg.isRead && !isMine && (
                                  <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {t('unread')}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {msg.content}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {msg.timeAgo || new Date(msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Message Detail Panel */}
                {selectedMessage && (
                  <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          selectedMessage.senderOid === user.oid
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {selectedMessage.senderOid === user.oid ? t('sent') : t('received')}
                        </span>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                          {selectedMessage.subject || t('message')}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessage(null)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                        <p>
                          {t('from')}: <span className="text-gray-700 dark:text-gray-300">
                            {selectedMessage.senderName || (selectedMessage.senderOid === user.oid ? t('you') : selectedMessage.senderOid)}
                          </span>
                        </p>
                        <p>
                          {t('to')}: <span className="text-gray-700 dark:text-gray-300">
                            {selectedMessage.receiverName || (selectedMessage.receiverOid === user.oid ? t('you') : selectedMessage.receiverOid)}
                          </span>
                        </p>
                        <p>{selectedMessage.timeAgo || new Date(selectedMessage.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('selectConversationToStart')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Compose Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('newMessage')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompose(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('to')}
                  </label>
                  <Input
                    placeholder={t('recipientIdOrName')}
                    value={newMessage.to}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('subject')} ({t('optional')})
                  </label>
                  <Input
                    placeholder={t('subjectOptional')}
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('message')}
                  </label>
                  <Textarea
                    placeholder={t('writeYourMessage')}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    rows={5}
                    className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCompose(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.to.trim() || !newMessage.content.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? t('sending') : t('send')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}