import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Search, MoreVertical, Paperclip } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

export function TeacherMessages() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedConversation, setSelectedConversation] = useState('conv1');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    { id: 'conv1', participantId: 's1', participantName: 'Bart Simpson', participantRole: 'student', lastMessage: 'Thank you for the feedback!', lastMessageTime: '2:30 PM', unread: 2 },
    { id: 'conv2', participantId: 'p1', participantName: 'Homer Simpson', participantRole: 'parent', lastMessage: 'When is the next parent meeting?', lastMessageTime: '1:15 PM', unread: 0 },
    { id: 'conv3', participantId: 's2', participantName: 'Stan Marsh', participantRole: 'student', lastMessage: 'I submitted my homework', lastMessageTime: 'Yesterday', unread: 1 },
    { id: 'conv4', participantId: 's3', participantName: 'Lisa Simpson', participantRole: 'student', lastMessage: 'Can I get extra credit?', lastMessageTime: 'Monday', unread: 0 },
  ];

  const messages = {
    conv1: [
      { id: '1', senderId: 's1', content: 'Hello, I have a question about the homework', timestamp: '2:15 PM', isMe: false },
      { id: '2', senderId: 'me', content: 'Sure, what would you like to know?', timestamp: '2:16 PM', isMe: true },
      { id: '3', senderId: 's1', content: "I'm confused about problem #5", timestamp: '2:17 PM', isMe: false },
      { id: '4', senderId: 'me', content: 'Let me explain. You need to use the quadratic formula for that one.', timestamp: '2:20 PM', isMe: true },
      { id: '5', senderId: 's1', content: 'Thank you for the feedback!', timestamp: '2:30 PM', isMe: false },
    ],
    conv2: [
      { id: '1', senderId: 'p1', content: "Hi, I wanted to discuss Bart's progress", timestamp: '1:00 PM', isMe: false },
      { id: '2', senderId: 'me', content: "Of course! I'd be happy to discuss that.", timestamp: '1:05 PM', isMe: true },
      { id: '3', senderId: 'p1', content: 'When is the next parent meeting?', timestamp: '1:15 PM', isMe: false },
    ],
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? (messages[selectedConversation] || []) : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) setMessageInput('');
  };

  const roleLabel = (role) => {
    if (role === 'student') return t('student');
    if (role === 'parent') return t('parent');
    return role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('messagesPage')}</h1>
          <p className="text-muted-foreground">{t('communicateWithStudentsParents')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="border-none shadow-md lg:col-span-1">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input
                  placeholder={t('searchConversationsPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation === conv.id
                        ? `bg-indigo-50 dark:bg-indigo-900/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-indigo-600 dark:border-indigo-400`
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          {conv.participantName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">{conv.participantName}</h4>
                          <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        <span className="text-xs text-muted-foreground/70">{roleLabel(conv.participantRole)}</span>
                      </div>
                      {conv.unread > 0 && (
                        <div className="h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="border-none shadow-md lg:col-span-2">
          {selectedConv ? (
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      {selectedConv.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="font-medium text-foreground">{selectedConv.participantName}</h3>
                    <p className="text-sm text-muted-foreground">{roleLabel(selectedConv.participantRole)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                      <div className="max-w-[70%] space-y-1">
                        <div className={`rounded-lg px-4 py-2 ${message.isMe ? 'bg-indigo-600 text-white' : 'bg-muted text-foreground'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground ${message.isMe ? (isRTL ? 'text-left' : 'text-right') : (isRTL ? 'text-right' : 'text-left')}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border bg-muted/50">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder={t('typeYourMessage')}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>{t('selectConversationToStart')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}