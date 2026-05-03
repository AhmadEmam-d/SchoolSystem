import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserCircle, Mail, Phone, Building, Edit, Save, Shield } from 'lucide-react';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function TeacherProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    employeeId: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('teacher_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.getProfile();
        if (data) {
          setProfile({
            name: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            position: data.position || '',
            department: data.department || '',
            employeeId: data.employeeId || '',
          });
          if (data.avatar) {
            setProfileImage(data.avatar);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(t('errorFetchingProfile') || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleSave = async () => {
    try {
      const result = await api.profile.updateProfile({
        profileData: {
          fullName: profile.name,
          phone: profile.phone,
          position: profile.position,
          department: profile.department,
          avatar: profileImage || '',
        },
      });

      if (result.success) {
        if (profileImage) {
          localStorage.setItem('teacher_profile_image', profileImage);
        } else {
          localStorage.removeItem('teacher_profile_image');
        }
        setIsEditing(false);
        toast.success(t('profileUpdatedSuccess'));
      } else {
        toast.error(result.message || t('errorUpdatingProfile') || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('errorUpdatingProfile') || 'Failed to update profile');
    }
  };

  const handleImageChange = async (imageUrl, file) => {
    setProfileImage(imageUrl);

    if (file) {
      try {
        const result = await api.profile.uploadAvatar(file);
        if (result && result.success === false) {
          toast.error(result.message || t('errorUploadingAvatar') || 'Failed to upload avatar');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error(t('errorUploadingAvatar') || 'Failed to upload avatar');
      }
    }
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
            <>
              <Save className="h-4 w-4" />
              {t('saveProfile')}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              {t('editProfile')}
            </>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
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
                    <p className="text-gray-900 dark:text-gray-200">{profile.email}</p>
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('position')}
                    </label>
                    <p className="text-gray-900 dark:text-gray-200">{profile.position}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building className="h-4 w-4" />
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('employeeId')}</label>
                    <p className="text-gray-900 dark:text-gray-200">{profile.employeeId}</p>
                  </div>

                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Shield className="h-5 w-5" />
            {t('securityTab')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{t('passwordLabel')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('lastBackupTime')}</p>
            </div>
            <button
              onClick={() => navigate('/change-password')}
              className="px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              {t('changePassword')}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{t('twoFactorAuth')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('twoFactorAuthDesc')}</p>
            </div>
            <button className="px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              {t('add')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}