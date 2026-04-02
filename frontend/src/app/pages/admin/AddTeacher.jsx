import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5073/api';

export function AddTeacher() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    email: '',
    phone: '',
    subjectOids: []
  });

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error(t('pleaseLogin'));
          return;
        }

        const response = await fetch(`${API_BASE_URL}/Subjects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setSubjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error(t('errorFetchingSubjects'));
      }
    };
    
    fetchSubjects();
  }, [t]);

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Invalid email format');
    if (!formData.phone?.match(/^[0-9]{10,15}$/)) errors.push('Phone must be 10-15 digits');
    if (!formData.subjectOids || formData.subjectOids.length === 0) errors.push('Please select at least one subject');
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      // Wrap the data in a "teacher" object as expected by the API
      const teacherData = {
        teacher: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subjectOids: formData.subjectOids
        }
      };
      
      console.log('Sending teacher data:', JSON.stringify(teacherData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/Teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teacherData)
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok && data.success) {
        toast.success('Teacher added successfully!');
        navigate('/admin/teachers');
      } else {
        // Display error messages from server
        if (data.errors) {
          // Handle nested errors
          if (data.errors.Teacher && Array.isArray(data.errors.Teacher)) {
            data.errors.Teacher.forEach(error => toast.error(error));
          } else if (typeof data.errors === 'object') {
            Object.values(data.errors).forEach(error => {
              if (Array.isArray(error)) {
                error.forEach(msg => toast.error(msg));
              } else if (typeof error === 'string') {
                toast.error(error);
              }
            });
          }
        } else if (data.message) {
          toast.error(data.message);
        } else if (data.messages?.EN) {
          toast.error(data.messages.EN);
        } else if (data.title) {
          toast.error(data.title);
        } else {
          toast.error(`Failed to add teacher: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, subjectOids: selectedOptions }));
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/teachers')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Add New Teacher</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the teacher information below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arabic Name
                </label>
                <input
                  type="text"
                  name="arabicName"
                  value={formData.arabicName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="teacher@school.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="01234567890"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teaching Subjects *
                </label>
                <select
                  name="subjectOids"
                  multiple
                  value={formData.subjectOids}
                  onChange={handleSubjectChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  size={6}
                  disabled={loading}
                >
                  {subjects.map(subject => (
                    <option key={subject.oid} value={subject.oid}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Hold Ctrl (or Cmd on Mac) to select multiple subjects
                </p>
                {formData.subjectOids.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {formData.subjectOids.length} subject(s)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/teachers')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
}