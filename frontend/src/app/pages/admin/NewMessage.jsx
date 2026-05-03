import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Paperclip, Users, User, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function NewMessage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    receiverOid: '',
    isGroupMessage: false,
    targetRole: '',
    parentMessageOid: null
  });

  const [recipientType, setRecipientType] = useState('individual'); // individual, teachers, parents

  // Fetch users for individual recipient selection
  useEffect(() => {
    const fetchUsers = async () => {
      if (recipientType === 'individual') {
        setLoadingUsers(true);
        try {
          let allUsers = [];
          
          // Fetch teachers
          try {
            const teachersResponse = await api.teachers?.getAll();
            let teachers = [];
            
            if (teachersResponse) {
              if (Array.isArray(teachersResponse)) {
                teachers = teachersResponse;
              } else if (teachersResponse.success && Array.isArray(teachersResponse.data)) {
                teachers = teachersResponse.data;
              } else if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
                teachers = teachersResponse.data;
              }
            }
            
            teachers = teachers.map(u => ({ 
              ...u, 
              role: 'Teacher', 
              displayRole: 'Teacher',
              fullName: u.fullName || u.name || u.email || 'Unknown'
            }));
            allUsers = [...allUsers, ...teachers];
          } catch (error) {
            console.error("Error fetching teachers:", error);
          }
          
          // Fetch students
          try {
            const studentsResponse = await api.students?.getAll();
            let students = [];
            
            if (studentsResponse) {
              if (Array.isArray(studentsResponse)) {
                students = studentsResponse;
              } else if (studentsResponse.success && Array.isArray(studentsResponse.data)) {
                students = studentsResponse.data;
              } else if (studentsResponse.data && Array.isArray(studentsResponse.data)) {
                students = studentsResponse.data;
              }
            }
            
            students = students.map(u => ({ 
              ...u, 
              role: 'Student', 
              displayRole: 'Student',
              fullName: u.fullName || u.name || `${u.firstName} ${u.lastName}` || 'Unknown'
            }));
            allUsers = [...allUsers, ...students];
          } catch (error) {
            console.error("Error fetching students:", error);
          }
          
          // Fetch parents - FIXED: Make sure we handle the response correctly
          try {
            const parentsResponse = await api.parents?.getAll();
            console.log("Parents API response:", parentsResponse);
            let parents = [];
            
            if (parentsResponse) {
              if (Array.isArray(parentsResponse)) {
                parents = parentsResponse;
              } else if (parentsResponse.success && Array.isArray(parentsResponse.data)) {
                parents = parentsResponse.data;
              } else if (parentsResponse.data && Array.isArray(parentsResponse.data)) {
                parents = parentsResponse.data;
              } else if (parentsResponse.items && Array.isArray(parentsResponse.items)) {
                parents = parentsResponse.items;
              }
            }
            
            parents = parents.map(u => ({ 
              ...u, 
              role: 'Parent', 
              displayRole: 'Parent',
              fullName: u.fullName || u.name || `${u.firstName} ${u.lastName}` || u.email || 'Unknown'
            }));
            allUsers = [...allUsers, ...parents];
          } catch (error) {
            console.error("Error fetching parents:", error);
          }
          
          console.log("📚 All users loaded:", allUsers);
          console.log("📚 Parent count:", allUsers.filter(u => u.role === 'Parent').length);
          setUsers(allUsers);
          
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error(t('errorFetchingUsers') || 'Error loading users');
        } finally {
          setLoadingUsers(false);
        }
      }
    };
    
    fetchUsers();
  }, [recipientType, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = t('enterSubject') || 'Please enter a subject';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('enterMessage') || 'Please enter a message';
    }
    
    if (!formData.isGroupMessage && !formData.receiverOid) {
      newErrors.receiver = t('selectRecipient') || 'Please select a recipient';
    }
    
    if (formData.isGroupMessage && !formData.targetRole) {
      newErrors.targetRole = t('selectTargetRole') || 'Please select target role for group message';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      // Prepare payload according to your API spec
      const payload = {
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        receiverOid: !formData.isGroupMessage ? formData.receiverOid : null,
        isGroupMessage: formData.isGroupMessage,
        targetRole: formData.isGroupMessage ? formData.targetRole : null,
        parentMessageOid: formData.parentMessageOid || null
      };
      
      console.log("📤 Sending message payload:", payload);
      
      const res = await api.messages.send(payload);
      
      console.log("📥 Full send message response:", res);
      
      // Check for errors in response
      if (res.errors && res.errors.length > 0) {
        console.log("Validation errors:", res.errors);
        const errorMessages = res.errors.map(err => err.message || JSON.stringify(err)).join(', ');
        toast.error(errorMessages);
        return;
      }
      
      // Check if response has messages object with details
      if (res.messages) {
        console.log("Response messages:", res.messages);
        if (res.messages.EN) {
          toast.error(res.messages.EN);
          return;
        }
        if (res.messages.AR) {
          toast.error(res.messages.AR);
          return;
        }
      }
      
      if (res.success) {
        toast.success(t('messageSentSuccessfully') || 'Message sent successfully ✅');
        navigate('/admin/messages');
      } else {
        const errorMsg = res.message || t('sendFailed') || 'Failed to send message';
        toast.error(errorMsg);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('errorSendingMessage') || 'Error sending message ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRecipientTypeChange = (type) => {
    setRecipientType(type);
    // Set targetRole based on selection - using exact strings your API expects
    let targetRoleValue = '';
    if (type === 'teachers') {
      targetRoleValue = 'Teacher';
    } else if (type === 'parents') {
      targetRoleValue = 'Parent';
    }
    
    setFormData(prev => ({
      ...prev,
      isGroupMessage: type !== 'individual',
      targetRole: targetRoleValue,
      receiverOid: ''
    }));
    setSelectedUser(null);
    setErrors({});
  };

  const handleUserSelect = (e) => {
    const userOid = e.target.value;
    const user = users.find(u => u.oid === userOid);
    setSelectedUser(user);
    setFormData(prev => ({
      ...prev,
      receiverOid: userOid
    }));
    if (errors.receiver) {
      setErrors(prev => ({ ...prev, receiver: '' }));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Debug function to see what's happening
  const handleDebug = () => {
    console.log("=== Debug Info ===");
    console.log("Form data:", formData);
    console.log("Recipient type:", recipientType);
    console.log("Selected user:", selectedUser);
    console.log("All users:", users);
    console.log("Parent users:", users.filter(u => u.role === 'Parent'));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/messages')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('newMessage') || 'New Message'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('newMessageDesc') || 'Compose and send a new message'}
          </p>
        </div>
        {/* Debug button - remove in production */}
        <button
          type="button"
          onClick={handleDebug}
          className="ml-auto text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Debug
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Information */}
        <Card>
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              {t('recipientInfo') || 'Recipient Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Recipient Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleRecipientTypeChange('individual')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  recipientType === 'individual'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <User className={`h-6 w-6 mx-auto mb-2 ${
                  recipientType === 'individual' ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div className="font-medium">{t('individual') || 'Individual'}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('singleRecipient') || 'Send to one person'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRecipientTypeChange('teachers')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  recipientType === 'teachers'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Users className={`h-6 w-6 mx-auto mb-2 ${
                  recipientType === 'teachers' ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div className="font-medium">{t('allTeachers') || 'All Teachers'}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('broadcastToTeachers') || 'Send to all teachers'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRecipientTypeChange('parents')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  recipientType === 'parents'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Users className={`h-6 w-6 mx-auto mb-2 ${
                  recipientType === 'parents' ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div className="font-medium">{t('allParents') || 'All Parents'}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('broadcastToParents') || 'Send to all parents'}
                </p>
              </button>
            </div>

            {/* Individual Recipient Selection */}
            {recipientType === 'individual' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('selectRecipient') || 'Select Recipient'} <span className="text-red-500">*</span>
                </label>
                {loadingUsers ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-500">{t('loadingUsers') || 'Loading users...'}</span>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">{t('noUsersFound') || 'No users found'}</p>
                  </div>
                ) : (
                  <>
                    <select
                      value={formData.receiverOid}
                      onChange={handleUserSelect}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.receiver ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required={recipientType === 'individual'}
                    >
                      <option value="">{t('chooseRecipient') || '-- Choose a recipient --'}</option>
                      {users.map(user => (
                        <option key={user.oid} value={user.oid}>
                          {user.fullName} - {user.displayRole}
                        </option>
                      ))}
                    </select>
                    {errors.receiver && (
                      <p className="mt-1 text-sm text-red-500">{errors.receiver}</p>
                    )}
                    
                    {selectedUser && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedUser.fullName}</p>
                            <Badge className={getRoleBadgeColor(selectedUser.role)}>
                              {selectedUser.displayRole}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Group Message Info */}
            {recipientType !== 'individual' && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-300">
                      {recipientType === 'teachers' 
                        ? (t('sendingToAllTeachers') || 'Sending to all teachers')
                        : (t('sendingToAllParents') || 'Sending to all parents')
                      }
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      {t('groupMessageWarning') || 'This message will be sent to all selected recipients'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Content */}
        <Card>
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              {t('messageContent') || 'Message Content'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('subject') || 'Subject'} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('enterSubject') || 'Enter message subject...'}
                className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
                required
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('message') || 'Message'} <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                placeholder={t('writeMessage') || 'Write your message here...'}
                className={`w-full resize-none ${errors.content ? 'border-red-500' : ''}`}
                required
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

          
          </CardContent>
        </Card>

        {/* Preview Card */}
        {formData.subject && formData.content && (
          <Card className="border-2 border-purple-200 bg-purple-50/30 dark:bg-purple-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                {t('messagePreview') || 'Message Preview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formData.subject}
                </h3>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {formData.content.length > 200 
                    ? `${formData.content.substring(0, 200)}...` 
                    : formData.content}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/messages')}
            className="px-6 py-2"
          >
            {t('cancel') || 'Cancel'}
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('sending') || 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('sendMessage') || 'Send Message'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}