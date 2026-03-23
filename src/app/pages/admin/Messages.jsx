import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, Send, Plus } from 'lucide-react';

const MESSAGES = [
  { id: 1, sender: 'John Nash', subject: 'Math Curriculum Update', preview: 'Hi, I wanted to discuss the changes to the algebra module for next semester.', time: '10:30 AM', read: false },
  { id: 2, sender: 'Marie Curie', subject: 'Lab Equipment Request', preview: 'We need new beakers for the chemistry lab. Can you approve the budget?', time: 'Yesterday', read: true },
  { id: 3, sender: 'Homer Simpson', subject: "Bart's detention", preview: 'Is it really necessary for Bart to stay after school every day this week?', time: 'Yesterday', read: true },
];

export function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('messagesPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('messagesPageDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/messages/new')}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('newMessageBtn')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Message List */}
        <Card className="md:col-span-1 flex flex-col h-full dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-500`} />
              <Input
                placeholder={t('searchMessagesPlaceholder')}
                className={`${isRTL ? 'pr-8' : 'pl-8'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedMessage === msg.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                } ${!msg.read ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}
                onClick={() => setSelectedMessage(msg.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${!msg.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{msg.sender}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{msg.time}</span>
                </div>
                <h4 className={`text-sm mb-1 ${!msg.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-600 dark:text-gray-400'}`}>{msg.subject}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{msg.preview}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Detail */}
        <Card className="md:col-span-2 flex flex-col h-full dark:border-gray-700 dark:bg-gray-800">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="dark:bg-gray-700 dark:text-white">
                      {MESSAGES.find(m => m.id === selectedMessage)?.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{MESSAGES.find(m => m.id === selectedMessage)?.subject}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('fromLabel')}: <span className="font-medium text-gray-700 dark:text-gray-200">{MESSAGES.find(m => m.id === selectedMessage)?.sender}</span>
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">{MESSAGES.find(m => m.id === selectedMessage)?.time}</span>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {MESSAGES.find(m => m.id === selectedMessage)?.preview}
                </p>
              </div>
              <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('typeReplyPlaceholder')}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-lg font-medium">{t('selectMessageToRead')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
