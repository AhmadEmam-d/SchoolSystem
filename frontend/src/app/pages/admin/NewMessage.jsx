import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Paperclip, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { api } from '../../lib/api'; // ✅ مهم

export function NewMessage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipient: '',
    recipientType: 'individual',
    subject: '',
    message: '',
    priority: 'normal',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ تجهيز الداتا حسب الـ API
      const payload = {
        subject: formData.subject,
        content: formData.message,
        receiverOid: formData.recipientType === 'individual' ? formData.recipient : null,
        isGroupMessage: formData.recipientType !== 'individual',
        targetRole:
          formData.recipientType === 'teachers'
            ? 'Teacher'
            : formData.recipientType === 'parents'
            ? 'Parent'
            : null,
        parentMessageOid: null,
      };

      const res = await api.messages.send(payload);

      if (res.success) {
        toast.success("Message sent successfully ✅");
        navigate('/admin/messages');
      } else {
        toast.error(res.messages?.EN || "Failed to send message ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Error sending message ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/messages')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {t('newMessage')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('newMessageDesc')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Recipient */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recipientInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Type */}
              <div>
                <label className="block mb-2">{t('recipientType')}</label>
                <select
                  name="recipientType"
                  value={formData.recipientType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="individual">Individual</option>
                  <option value="teachers">All Teachers</option>
                  <option value="parents">All Parents</option>
                </select>
              </div>

              {/* Recipient */}
              {formData.recipientType === 'individual' && (
                <div>
                  <label className="block mb-2">{t('recipient')}</label>
                  <input
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Receiver OID"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}

              {formData.recipientType !== 'individual' && (
                <div className="flex items-center">
                  <Users className="mr-2" />
                  <span>
                    {formData.recipientType === 'teachers'
                      ? 'All Teachers'
                      : 'All Parents'}
                  </span>
                </div>
              )}

            </div>

          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>{t('messageContent')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Message"
              className="w-full px-4 py-2 border rounded-lg"
            />

          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/messages')}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

      </form>
    </div>
  );
}