import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, Send, Plus } from 'lucide-react';

export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ✅ Load Data
  useEffect(() => {
    api.messages.getInbox().then(res => {
      if (res.success) setMessages(res.data);
    });

    api.messages.getSummary().then(res => {
      if (res.success) setSummary(res.data);
    });
  }, []);

  const currentMessage = messages.find(m => m.oid === selectedMessage);

  // ✅ Send Reply
  const handleSend = async () => {
    if (!reply || !currentMessage) return;

    await api.messages.send({
      subject: "Reply",
      content: reply,
      receiverOid: currentMessage.senderOid
    });

    setReply("");
    alert("Message sent ✅");
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('messagesPage')}</h1>
          <p className="text-gray-500 mt-1">{t('messagesPageDesc')}</p>
        </div>

        <Button onClick={() => navigate('/admin/messages/new')}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('newMessageBtn')}
        </Button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm">Total</p>
            <p className="font-bold text-lg">{summary.totalMessages}</p>
          </div>

          <div className="p-3 bg-red-50 rounded">
            <p className="text-sm">Unread</p>
            <p className="font-bold text-lg">{summary.unreadCount}</p>
          </div>

          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm">Sent</p>
            <p className="font-bold text-lg">{summary.sentCount}</p>
          </div>

          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-sm">Received</p>
            <p className="font-bold text-lg">{summary.receivedCount}</p>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">

        {/* Message List */}
        <Card className="md:col-span-1 flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-500`} />
              <Input
                placeholder={t('searchMessagesPlaceholder')}
                className={`${isRTL ? 'pr-8' : 'pl-8'}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.oid}
                onClick={() => setSelectedMessage(msg.oid)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition
                  ${selectedMessage === msg.oid ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  ${!msg.isRead ? 'bg-white' : 'bg-gray-50/50'}
                `}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{msg.senderName}</span>
                  <span className="text-xs text-gray-400">{msg.timeAgo}</span>
                </div>

                <h4 className="text-sm font-semibold">{msg.subject}</h4>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Details */}
        <Card className="md:col-span-2 flex flex-col h-full">
          {currentMessage ? (
            <>
              <div className="p-6 border-b flex justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {currentMessage.senderName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="text-xl font-bold">
                      {currentMessage.subject}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {t('fromLabel')}:
                      <span className="ml-1 font-medium">
                        {currentMessage.senderName}
                      </span>
                    </p>
                  </div>
                </div>

                <span className="text-sm text-gray-400">
                  {currentMessage.timeAgo}
                </span>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentMessage.content}
                </p>
              </div>

              {/* Reply */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={t('typeReplyPlaceholder')}
                  />

                  <Button size="icon" onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Send className="h-8 w-8 mb-4" />
              <p>{t('selectMessageToRead')}</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}