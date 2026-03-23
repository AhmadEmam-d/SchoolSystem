import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserCircle, Mail, Phone, BookOpen, Edit, Save, Award, Calendar } from 'lucide-react';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { toast } from 'sonner';

export function TeacherProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Prof. John Smith',
    email: 'john.smith@edusmart.edu',
    phone: '+1 (555) 234-5678',
    employeeId: 'TCH-2024-042',
    department: 'Mathematics',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    joiningDate: 'September 1, 2020',
  });

  const subjects = [
    { name: 'Mathematics', classes: ['10-A', '10-B', '11-A'] },
    { name: 'Advanced Calculus', classes: ['12-A'] },
  ];

  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('teacher_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleSave = () => {
    if (profileImage) {
      localStorage.setItem('teacher_profile_image', profileImage);
    } else {
      localStorage.removeItem('teacher_profile_image');
    }
    setIsEditing(false);
    toast.success(t('profileUpdatedSuccess'));
  };

  const handleImageChange = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profilePage')}</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? (
            <><Save className="h-4 w-4" />{t('saveProfile')}</>
          ) : (
            <><Edit className="h-4 w-4" />{t('editProfile')}</>
          )}
        </button>
      </div>

      {/* Profile Information */}
      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <UserCircle className="h-5 w-5" />
            {t('personalInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfilePictureUpload
            currentImage={profileImage || undefined}
            userName={profile.name}
            onImageChange={handleImageChange}
            isEditing={isEditing}
          />

          <div className="pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullNameLabel')}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('email')}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-200">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('phone')}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-200">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('employeeId')}</label>
                <p className="text-gray-900 dark:text-gray-200">{profile.employeeId}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {t('department')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-200">{profile.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('hireDate')}
                </label>
                <p className="text-gray-900 dark:text-gray-200">{profile.joiningDate}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {t('qualification')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.qualification}
                    onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-200">{profile.qualification}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Teaching Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {subject.classes.map((cls, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Password</h3>
              <p className="text-sm text-gray-500">Last changed 45 days ago</p>
            </div>
            <button 
              onClick={() => navigate('/change-password')}
              className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Change Password
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
