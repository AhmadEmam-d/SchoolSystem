import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { api } from '../../lib/api';

const TYPE_OPTIONS = ['Info', 'Warning', 'Success'];
const PRIORITY_OPTIONS = ['Normal', 'High', 'Urgent'];
const ROLE_OPTIONS = ['All', 'Admin', 'Teacher', 'Student', 'Parent'];

export function AddNotification() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'Info',
    priority: 'Normal',
    userOid: '',
    targetRole: 'All',
    actionUrl: '',
    icon: '',
    color: '',
    expiryDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    if (!form.type) newErrors.type = 'Type is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    if (!form.targetRole) newErrors.targetRole = 'Target role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    // Build payload matching backend CreateNotificationDto
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      priority: form.priority,
      userOid: form.userOid.trim() ? form.userOid.trim() : null,
      targetRole: form.targetRole,
      actionUrl: form.actionUrl.trim() || '',
icon: form.icon.trim() || '',
color: form.color.trim() || '',
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
    };
try {
  const res = await api.notifications.send(payload);
  console.log('Response:', res);
  if (!res.success) {
    console.error('Backend error:', JSON.stringify(res.errors, null, 2));
    setErrors(prev => ({ ...prev, submit: res.message || 'Failed to send notification' }));
    return;
  }
  navigate(-1);
} catch (err) {
  console.error(err);
  setErrors(prev => ({ ...prev, submit: 'Failed to send notification' }));
} finally {
  setSubmitting(false);
}
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-purple-600" />
            Add Notification
          </h1>
          <p className="text-gray-500 mt-1">
            Send a notification to users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Notification title"
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <Textarea
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Notification message"
              rows={4}
            />
            {errors.message && (
              <p className="text-red-600 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* TYPE + PRIORITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority *</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TARGET ROLE + USER OID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Role *</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={form.targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value)}
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Specific User OID (optional)
              </label>
              <Input
                value={form.userOid}
                onChange={(e) => handleChange('userOid', e.target.value)}
                placeholder="Leave empty to target by role"
              />
            </div>
          </div>

          {/* ACTION URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Action URL (optional)</label>
            <Input
              value={form.actionUrl}
              onChange={(e) => handleChange('actionUrl', e.target.value)}
              placeholder="/admin/students"
            />
          </div>

          {/* ICON + COLOR */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon (optional)</label>
              <Input
                value={form.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="bell"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color (optional)</label>
              <Input
                value={form.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#7c3aed"
              />
            </div>
          </div>

          {/* EXPIRY DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date (optional)</label>
            <Input
              type="datetime-local"
              value={form.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
            />
          </div>

          {errors.submit && (
            <p className="text-red-600 text-sm">{errors.submit}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}