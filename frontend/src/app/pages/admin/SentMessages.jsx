import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Send, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function SentMessages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  // ✅ Load data from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.messages.getSent();

        if (res.success) {
          setMessages(res.data);
        } else {
          toast.error("Failed to load messages");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // ✅ Filter
  const filteredMessages = messages.filter(msg =>
    (msg.receiverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/messages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-purple-600">
              {t('sentMessages')}
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/messages/new')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg flex gap-2"
        >
          <Send className="h-5 w-5" />
          {t('newMessage')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg`}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border divide-y">

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No messages
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.oid} className="p-6 hover:bg-gray-50 cursor-pointer">

              <div className="flex justify-between">

                <div className="flex-1">

                  {/* Receiver */}
                  <div className="flex gap-2 mb-2 items-center">
                    <h3 className="font-semibold">
                      {msg.isGroupMessage
                        ? (msg.targetRole || "Group")
                        : (msg.receiverName || "Unknown")}
                    </h3>

                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {msg.isGroupMessage ? "Group" : msg.receiverRole}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded ${
                      msg.isRead
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {msg.isRead ? "Read" : "Sent"}
                    </span>
                  </div>

                  {/* Subject */}
                  <p className="font-medium mb-1">
                    {msg.subject}
                  </p>

                  {/* Preview */}
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {msg.content}
                  </p>

                </div>

                {/* Time */}
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <Clock className="h-4 w-4" />
                  {msg.timeAgo}
                </div>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}