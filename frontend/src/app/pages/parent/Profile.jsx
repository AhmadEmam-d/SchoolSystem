import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserCircle, Mail, Phone, MapPin, Edit, Save, Users, Shield } from 'lucide-react';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function ParentProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [linkedChildren, setLinkedChildren] = useState([]);

  // ── Load profile image from localStorage ──────────────────────────────────
  useEffect(() => {
    const savedImage = localStorage.getItem('parent_profile_image');
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // ── Fetch profile from API ────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.getProfile();
        if (data) {
          setProfile({
            name:    data.fullName    || data.name    || '',
            email:   data.email                       || '',
            phone:   data.phone                       || '',
            address: data.address                     || '',
          });
          if (data.avatar) setProfileImage(data.avatar);
          if (Array.isArray(data.children)) setLinkedChildren(data.children);
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

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const result = await api.profile.updateProfile({
        profileData: {
          fullName: profile.name,
          phone:    profile.phone,
          address:  profile.address,
          avatar:   profileImage || '',
        },
      });
      if (result.success) {
        if (profileImage) {
          localStorage.setItem('parent_profile_image', profileImage);
        } else {
          localStorage.removeItem('parent_profile_image');
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

  // ── Avatar upload ─────────────────────────────────────────────────────────
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
        <h1 className="text-3xl font-bold text-foreground">{t('profile')}</h1>
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

      {/* Parent Information */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            {t('parentInformationTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <>
              <ProfilePictureUpload
                currentImage={profileImage || undefined}
                userName={profile.name}
                onImageChange={handleImageChange}
                isEditing={isEditing}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('fullName')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.name || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />{t('email')}
                  </label>
                  <p className="text-foreground">{profile.email || '—'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />{t('phone')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-foreground">{profile.phone || '—'}</p>
                  )}
                </div>

             
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Linked Children */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('linkedChildrenTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : linkedChildren.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">{t('noLinkedChildren') || 'No linked children found.'}</p>
          ) : (
            <div className="space-y-3">
              {linkedChildren.map((child) => (
                <div
                  key={child.id || child.oid}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {(child.name || child.fullName || '?').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{child.name || child.fullName || '—'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {[child.grade, child.class || child.className].filter(Boolean).join(' • ')}
                        {child.rollNo || child.rollNumber ? ` • ${t('rollNo')}: ${child.rollNo || child.rollNumber}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
                    {t('activeStatus')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('accountSecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('passwordLbl')}</h3>
              <p className="text-sm text-muted-foreground">{t('lastChanged90')}</p>
            </div>
            <button
              onClick={() => navigate('/change-password')}
              className="px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              {t('changePassword')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}