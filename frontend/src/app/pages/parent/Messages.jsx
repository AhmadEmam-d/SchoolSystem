import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Send, Search, MoreVertical, Mail, Clock, Inbox, Edit, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { api } from '../../lib/api';

export function ParentMessages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [conversations,   setConversations]   = useState([]);
  const [messages,        setMessages]        = useState({});
  const [selectedUser,    setSelectedUser]    = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [summary,         setSummary]         = useState(null);
  const [filter,          setFilter]          = useState('all');
  const [search,          setSearch]          = useState('');
  const [loading,         setLoading]         = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (selectedUser && !messages[selectedUser]) fetchMessagesForUser(selectedUser);
  }, [selectedUser]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchConversations(), fetchAllMessages()]);
    setLoading(false);
  };

  const fetchSummary = async () => {
    try { setSummary(await api.messages.getSummary()); } catch (e) { console.error(e); }
  };

  const fetchConversations = async () => {
    try { setConversations((await api.messages.getConversations()) || []); } catch (e) { console.error(e); }
  };

  const fetchAllMessages = async () => {
    try {
      const [inbox, sent] = await Promise.all([api.messages.getInbox(), api.messages.getSent()]);
      const inboxMsgs = (inbox || []).map(m => ({ ...m, _dir: 'received' }));
      const sentMsgs  = (sent  || []).map(m => ({ ...m, _dir: 'sent' }));

      const grouped = {};
      [...inboxMsgs, ...sentMsgs].forEach(msg => {
        const other = msg.senderOid === user.oid ? msg.receiverOid : msg.senderOid;
        if (!grouped[other]) grouped[other] = [];
        if (!grouped[other].find(x => x.oid === msg.oid)) grouped[other].push(msg);
      });
      Object.keys(grouped).forEach(k =>
        grouped[k].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );
      setMessages(grouped);
    } catch (e) { console.error(e); }
  };

  const fetchMessagesForUser = async (userOid) => {
    if (messages[userOid]) return;
    try {
      const [inbox, sent] = await Promise.all([api.messages.getInbox(), api.messages.getSent()]);
      const all = [...(inbox || []), ...(sent || [])];
      const filtered = all
        .filter(m => m.senderOid === userOid || m.receiverOid === userOid)
        .map(m => ({ ...m, _dir: m.senderOid === user.oid ? 'sent' : 'received' }))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setMessages(prev => ({ ...prev, [userOid]: filtered }));
    } catch (e) { console.error(e); }
  };

  const markAsRead = async (userOid) => {
    const conv = conversations.find(c => c.userOid === userOid);
    if (!conv?.unreadCount) return;
    setConversations(prev => prev.map(c => c.userOid === userOid ? { ...c, unreadCount: 0 } : c));
    setSummary(prev => prev ? { ...prev, unreadCount: Math.max(0, (prev.unreadCount || 0) - conv.unreadCount) } : prev);
    const unread = (messages[userOid] || []).filter(m => !m.isRead && m.senderOid !== user.oid);
    await Promise.allSettled(unread.map(m => api.messages.markAsRead(m.oid)));
  };

  const filteredConversations = conversations.filter(conv => {
    const matchSearch = conv.userName?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'sent')   return (messages[conv.userOid] || []).some(m => m._dir === 'sent');
    return true;
  });

  const currentMessages = selectedUser ? (messages[selectedUser] || []) : [];
  const selectedConv    = conversations.find(c => c.userOid === selectedUser);

  const filterTabs = [
    { id: 'all',    label: t('all'),      icon: <Inbox className="h-3.5 w-3.5" /> },
    { id: 'unread', label: t('unread'),   icon: <Clock className="h-3.5 w-3.5" />  },
    { id: 'sent',   label: t('sent'),     icon: <Send className="h-3.5 w-3.5" />   },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('messagesPage')}</h1>
          <p className="text-muted-foreground mt-1">{t('communicateWithTeachersStaff')}</p>
        </div>
        <Button
          onClick={() => navigate('/parent/messages/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Edit className="h-4 w-4" />
          {t('newMessage')}
        </Button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('totalMessages'), value: summary.totalMessages,  icon: Mail,  color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: t('unread'),        value: summary.unreadCount,    icon: Clock, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
            { label: t('sent'),          value: summary.sentCount,      icon: Send,  color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
            { label: t('received'),      value: summary.receivedCount,  icon: Inbox, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{value ?? '—'}</p>
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

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">

        {/* Conversations List */}
        <Card className="border-none shadow-md lg:col-span-1">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input
                  placeholder={t('searchConversationsPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-2 gap-1 border-b border-border">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    filter === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
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
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedUser === conv.userOid
                        ? `bg-indigo-50 dark:bg-indigo-900/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-indigo-600`
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          {(conv.userName || '?').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">{conv.userName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {conv.lastMessageTime
                              ? new Date(conv.lastMessageTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                              : ''}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        <span className="text-xs text-muted-foreground capitalize">{conv.role}</span>
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

        {/* Chat Panel */}
        <Card className="border-none shadow-md lg:col-span-2">
          {selectedConv ? (
            <CardContent className="p-0 h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      {(selectedConv.userName || '?').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedConv.userName}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{selectedConv.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {currentMessages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('noMessagesYet')}</p>
                      </div>
                    )}
                    {currentMessages.map(msg => {
                      const isMine    = msg.senderOid === user.oid;
                      const isSelected = selectedMessage?.oid === msg.oid;
                      return (
                        <div
                          key={msg.oid}
                          onClick={() => setSelectedMessage(isSelected ? null : msg)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-3">
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
                                  <span className="text-xs font-medium text-foreground">{msg.subject}</span>
                                )}
                                {!msg.isRead && !isMine && (
                                  <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />{t('unread')}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {msg.timeAgo || new Date(msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Selected Message Detail */}
                {selectedMessage && (
                  <div className="border-t border-border bg-muted/50">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          selectedMessage.senderOid === user.oid
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {selectedMessage.senderOid === user.oid ? t('sent') : t('received')}
                        </span>
                        <h4 className="font-medium text-sm text-foreground">
                          {selectedMessage.subject || t('message')}
                        </h4>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)}>✕</Button>
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground mb-3 space-y-1">
                        <p>{t('from')}: <span className="text-foreground">{selectedMessage.senderName || (selectedMessage.senderOid === user.oid ? t('you') : selectedMessage.senderOid)}</span></p>
                        <p>{t('to')}: <span className="text-foreground">{selectedMessage.receiverName || (selectedMessage.receiverOid === user.oid ? t('you') : selectedMessage.receiverOid)}</span></p>
                        <p>{selectedMessage.timeAgo || new Date(selectedMessage.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('selectConversationToStart')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}