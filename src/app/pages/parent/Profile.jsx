import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserCircle, Mail, Phone, MapPin, Edit, Save, Users, Shield } from 'lucide-react';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { toast } from 'sonner';

export function ParentProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Homer Simpson',
    email: 'homer.simpson@email.com',
    phone: '+1 (555) 123-4567',
    address: '742 Evergreen Terrace, Springfield',
  });

  const linkedChildren = [
    { id: 1, name: 'Bart Simpson', grade: 'Grade 10', class: '10-A', rollNo: '2024001' },
    { id: 2, name: 'Lisa Simpson', grade: 'Grade 8', class: '8-B', rollNo: '2024045' },
    { id: 3, name: 'Maggie Simpson', grade: 'Kindergarten', class: 'KG-1', rollNo: '2024089' },
  ];

  useEffect(() => {
    const savedImage = localStorage.getItem('parent_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleSave = () => {
    if (profileImage) {
      localStorage.setItem('parent_profile_image', profileImage);
    } else {
      localStorage.removeItem('parent_profile_image');
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
        <h1 className="text-3xl font-bold text-foreground">{t('profile')}</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              {t('saveChanges')}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              {t('editProfile')}
            </>
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
                <p className="text-foreground font-medium">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-foreground">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('phone')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-foreground">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('address')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-foreground">{profile.address}</p>
              )}
            </div>
          </div>
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
          <div className="space-y-3">
            {linkedChildren.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {child.grade} • {child.class} • {t('rollNo')}: {child.rollNo}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
                  {t('activeStatus')}
                </span>
              </div>
            ))}
          </div>
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
