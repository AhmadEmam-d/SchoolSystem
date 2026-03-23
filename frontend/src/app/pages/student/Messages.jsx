import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Search, MoreVertical, Paperclip } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

export function StudentMessages() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedConversation, setSelectedConversation] = useState('conv1');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    { id: 'conv1', participantId: 't1', participantName: 'John Nash', participantRole: 'teacher', lastMessage: 'Great work on your last assignment!', lastMessageTime: '2:30 PM', unread: 1 },
    { id: 'conv2', participantId: 't2', participantName: 'Marie Curie', participantRole: 'teacher', lastMessage: "Don't forget the lab report due Friday", lastMessageTime: '1:15 PM', unread: 0 },
    { id: 'conv3', participantId: 't4', participantName: 'Shakespeare', participantRole: 'teacher', lastMessage: 'Your essay showed improvement', lastMessageTime: 'Yesterday', unread: 0 },
    { id: 'conv4', participantId: 'admin', participantName: 'School Admin', participantRole: 'admin', lastMessage: 'Exam schedule has been updated', lastMessageTime: 'Monday', unread: 2 },
  ];

  const messages = {
    conv1: [
      { id: '1', senderId: 't1', content: 'Hi! I reviewed your homework submission', timestamp: '2:00 PM', isMe: false },
      { id: '2', senderId: 'me', content: 'Thank you! How did I do?', timestamp: '2:05 PM', isMe: true },
      { id: '3', senderId: 't1', content: 'Great work on your last assignment! You showed good understanding of quadratic equations.', timestamp: '2:30 PM', isMe: false },
    ],
    conv2: [
      { id: '1', senderId: 't2', content: 'Hello class! Remember to complete your lab reports', timestamp: '1:00 PM', isMe: false },
      { id: '2', senderId: 'me', content: 'What should we include in the conclusion?', timestamp: '1:10 PM', isMe: true },
      { id: '3', senderId: 't2', content: "Don't forget the lab report due Friday. Make sure to include your observations and analysis.", timestamp: '1:15 PM', isMe: false },
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
    if (role === 'teacher') return t('teacher');
    if (role === 'admin') return t('roleAdmin');
    return role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('messagesPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('communicateWithTeachers')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card className="border-none shadow-md lg:col-span-1 dark:bg-gray-800">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <Input
                  placeholder={t('searchConversationsPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y dark:divide-gray-700">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedConversation === conv.id
                        ? `bg-indigo-50 dark:bg-indigo-900/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-indigo-600`
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          {conv.participantName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{conv.participantName}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{roleLabel(conv.participantRole)}</span>
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

        <Card className="border-none shadow-md lg:col-span-2 dark:bg-gray-800">
          {selectedConv ? (
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      {selectedConv.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{selectedConv.participantName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{roleLabel(selectedConv.participantRole)}</p>
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
                      <div className="max-w-[70%]">
                        <div className={`rounded-lg px-4 py-2 ${message.isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.isMe ? (isRTL ? 'text-left' : 'text-right') : (isRTL ? 'text-right' : 'text-left')}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder={t('typeYourMessage')}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      rows={2}
                      className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>{t('selectConversationToStart')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
