import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5073/api';

export function AddStudent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [parents, setParents] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    classOid: '',
    sectionOid: '',
    parentOid: ''
  });

  // Fetch classes, sections, and parents
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error(t('pleaseLogin'));
          return;
        }

        const [classesRes, sectionsRes, parentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/Classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/Sections`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/Parents`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json())
        ]);
        
        if (classesRes.success) {
          setClasses(classesRes.data);
        }
        
        if (sectionsRes.success) {
          setSections(sectionsRes.data);
        }
        
        if (parentsRes.success) {
          setParents(parentsRes.data);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);

  // Filter sections based on selected class
  useEffect(() => {
    if (formData.classOid && sections.length > 0) {
      const filtered = sections.filter(section => section.class?.oid === formData.classOid);
      setFilteredSections(filtered);
      
      if (formData.sectionOid) {
        setFormData(prev => ({ ...prev, sectionOid: '' }));
      }
    } else {
      setFilteredSections([]);
    }
  }, [formData.classOid, sections]);

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Invalid email format');
    if (!formData.phone?.match(/^[0-9]{10,15}$/)) errors.push('Phone must be 10-15 digits');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.classOid) errors.push('Please select a class');
    if (!formData.sectionOid) errors.push('Please select a section');
    if (!formData.parentOid) errors.push('Please select a parent');
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    // تأكد من أن التاريخ بصيغة YYYY-MM-DD
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
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

      // Prepare data exactly as API expects
      const studentData = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        dateOfBirth: formatDateForAPI(formData.dateOfBirth),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        classOid: formData.classOid,
        sectionOid: formData.sectionOid,
        parentOid: formData.parentOid
      };
      
      // Only add address if it has value
      if (formData.address && formData.address.trim()) {
        studentData.address = formData.address.trim();
      }
      
      console.log('Sending data:', JSON.stringify(studentData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/Students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok && data.success) {
        toast.success('Student added successfully!');
        navigate('/admin/students');
      } else {
        // Display error messages from server
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(error => toast.error(error));
        } else if (data.message) {
          toast.error(data.message);
        } else if (data.messages?.EN) {
          toast.error(data.messages.EN);
        } else {
          toast.error(`Failed to add student: ${response.status}`);
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

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/students')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Add New Student</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the student information below</p>
          </div>
        </div>
      </div>

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
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="student@school.com"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter address"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class / Grade *
                </label>
                <select
                  name="classOid"
                  value={formData.classOid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.oid} value={cls.oid}>
                      {cls.name} - {cls.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section *
                </label>
                <select
                  name="sectionOid"
                  value={formData.sectionOid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading || !formData.classOid}
                >
                  <option value="">Select Section</option>
                  {filteredSections.map(section => (
                    <option key={section.oid} value={section.oid}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Parent *
                </label>
                <select
                  name="parentOid"
                  value={formData.parentOid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="">Select Parent</option>
                  {parents.map(parent => (
                    <option key={parent.oid} value={parent.oid}>
                      {parent.fatherName} / {parent.motherName} - {parent.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/students')}
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
            {loading ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
}