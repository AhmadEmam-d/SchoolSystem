import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserCircle, Mail, Phone, Users, Edit, Save, GraduationCap, Calendar, Hash, Shield } from 'lucide-react';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    grade: '',
    class: '',
    rollNo: '',
    dateOfBirth: '',
    admissionDate: '',
  });
  const [parentInfo, setParentInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('student_profile_image');
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.getProfile();
        if (data) {
          setProfile({
            name:          data.fullName       || data.name          || '',
            email:         data.email                                || '',
            phone:         data.phone                                || '',
            studentId:     data.studentId      || data.employeeId    || '',
            grade:         data.grade                                || '',
            class:         data.class          || data.className     || '',
            rollNo:        data.rollNo         || data.rollNumber    || '',
            dateOfBirth:   data.dateOfBirth                         || '',
            admissionDate: data.admissionDate                       || '',
          });
          if (data.parentName || data.parentEmail || data.parentPhone) {
            setParentInfo({
              name:  data.parentName  || '',
              email: data.parentEmail || '',
              phone: data.parentPhone || '',
            });
          }
          if (data.avatar) setProfileImage(data.avatar);
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
          phone:    profile.phone,
          avatar:   profileImage || '',
        },
      });
      if (result.success) {
        if (profileImage) {
          localStorage.setItem('student_profile_image', profileImage);
        } else {
          localStorage.removeItem('student_profile_image');
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
        <h1 className="text-3xl font-bold text-gray-900">{t('profilePage')}</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? (
            <><Save className="h-4 w-4" />{t('saveChanges')}</>
          ) : (
            <><Edit className="h-4 w-4" />{t('editProfile')}</>
          )}
        </button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            {t('studentInformation')}
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

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('fullName')}</label>
                    {isEditing ? (
                      <input type="text" value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.name || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />{t('email')}
                    </label>
                    <p className="text-gray-900">{profile.email || '—'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />{t('phone')}
                    </label>
                    {isEditing ? (
                      <input type="tel" value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="h-4 w-4" />{t('studentId')}
                    </label>
                    <p className="text-gray-900">{profile.studentId || '—'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />{t('gradeAndClass')}
                    </label>
                    <p className="text-gray-900">
                      {[profile.grade, profile.class].filter(Boolean).join(' - ') || '—'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('rollNumber')}</label>
                    <p className="text-gray-900">{profile.rollNo || '—'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />{t('dateOfBirth')}
                    </label>
                    <p className="text-gray-900">{profile.dateOfBirth || '—'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('admissionDate')}</label>
                    <p className="text-gray-900">{profile.admissionDate || '—'}</p>
                  </div>

                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Parent/Guardian Information */}
      {(parentInfo.name || parentInfo.email || parentInfo.phone) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('parentGuardianInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('nameLbl')}</label>
                <p className="text-gray-900">{parentInfo.name || '—'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />{t('email')}
                </label>
                <p className="text-gray-900">{parentInfo.email || '—'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />{t('phone')}
                </label>
                <p className="text-gray-900">{parentInfo.phone || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('accountSecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{t('passwordLbl')}</h3>
              <p className="text-sm text-gray-500">{t('lastChanged60')}</p>
            </div>
            <button
              onClick={() => navigate('/change-password')}
              className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {t('changePassword')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}