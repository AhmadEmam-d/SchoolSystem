import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Save, Bell, Lock, Globe, Sun, Moon, KeyRound, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';

export function StudentSettings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminders: true,
    gradeUpdates: true,
    // Security settings
    twoFactorAuthentication: false,
    sessionTimeoutMinutes: 30,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    rtlMode: false,
  });

  // Load settings from API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // جلب إعدادات الإشعارات
      const notifications = await api.settings.getNotifications();
      if (notifications) {
        setSettings(prev => ({
          ...prev,
          emailNotifications: notifications.emailNotifications ?? true,
          pushNotifications: notifications.pushNotifications ?? true,
          attendanceReminders: notifications.attendanceReminders ?? true,
          gradeUpdates: notifications.gradeUpdates ?? true,
        }));
      }

      // جلب إعدادات الأمان
      const security = await api.settings.getSecurity();
      if (security) {
        setSettings(prev => ({
          ...prev,
          twoFactorAuthentication: security.twoFactorAuthentication ?? false,
          sessionTimeoutMinutes: security.sessionTimeoutMinutes ?? 30,
        }));
      }

      // جلب إعدادات المظهر
      const appearance = await api.settings.getAppearance();
      if (appearance) {
        setAppearanceSettings({
          theme: appearance.theme || theme,
          compactMode: appearance.compactMode ?? false,
          rtlMode: appearance.rtlMode ?? (currentLanguage === 'ar'),
        });
        
        // تطبيق الثيم من الـ API
        if (appearance.theme && appearance.theme !== theme) {
          setTheme(appearance.theme);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error(t('failedToLoadSettings'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const result = await api.settings.updateNotifications({
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        attendanceReminders: settings.attendanceReminders,
        gradeUpdates: settings.gradeUpdates,
      });
      
      if (result.success) {
        toast.success(t('notificationsSaved'));
      } else {
        toast.error(result.message || t('failedToSave'));
      }
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error(t('failedToSaveSettings'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      const result = await api.settings.updateSecurity({
        twoFactorAuthentication: settings.twoFactorAuthentication,
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
      });
      
      if (result.success) {
        toast.success(t('securitySettingsSaved'));
      } else {
        toast.error(result.message || t('failedToSave'));
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error(t('failedToSaveSettings'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    try {
      const result = await api.settings.updateAppearance({
        theme: appearanceSettings.theme,
        compactMode: appearanceSettings.compactMode,
        rtlMode: appearanceSettings.rtlMode,
      });
      
      if (result.success) {
        toast.success(t('appearanceSaved'));
      } else {
        toast.error(result.message || t('failedToSave'));
      }
    } catch (error) {
      console.error('Error saving appearance:', error);
      toast.error(t('failedToSaveSettings'));
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (lang) => {
    changeLanguage(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      }
      toast.success(t('languageUpdated'));
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setAppearanceSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('manageAccountSettings')}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
          <TabsTrigger value="general">{t('generalSettings')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notificationSettings')}</TabsTrigger>
          <TabsTrigger value="security">{t('securityTab')}</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Language Settings */}
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                <CardTitle className="dark:text-white">{t('language')}</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">{t('languageChooseDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">{t('language')}</Label>
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="dark:text-white">{t('appearance')}</CardTitle>
                </div>
                <Button 
                  onClick={handleSaveAppearance} 
                  disabled={saving}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="ml-2">{t('save')}</span>
                </Button>
              </div>
              <CardDescription className="dark:text-gray-400">{t('customizeAppDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">{t('theme')}</Label>
                <Select value={appearanceSettings.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        {t('light')}
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        {t('dark')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="dark:text-white">{t('notificationPreferences')}</CardTitle>
                </div>
                <Button 
                  onClick={handleSaveNotifications} 
                  disabled={saving}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="ml-2">{t('save')}</span>
                </Button>
              </div>
              <CardDescription className="dark:text-gray-400">{t('manageNotificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="dark:text-gray-200">{t('emailNotifications')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="dark:text-gray-200">{t('pushNotifications')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pushNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="dark:text-gray-200">{t('attendanceReminders')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('attendanceRemindersDesc')}</p>
                </div>
                <Switch
                  checked={settings.attendanceReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, attendanceReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="dark:text-gray-200">{t('gradeUpdatesLabel')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('gradeUpdatesStudentDesc')}</p>
                </div>
                <Switch
                  checked={settings.gradeUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, gradeUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="dark:text-white">{t('securityTab')}</CardTitle>
                </div>
                <Button 
                  onClick={handleSaveSecurity} 
                  disabled={saving}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="ml-2">{t('save')}</span>
                </Button>
              </div>
              <CardDescription className="dark:text-gray-400">{t('manageSecurityDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="dark:text-gray-200">{t('twoFactorAuth')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('twoFactorAuthDesc')}</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuthentication}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuthentication: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">{t('sessionTimeout')}</Label>
                <Select 
                  value={String(settings.sessionTimeoutMinutes)} 
                  onValueChange={(value) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {t('minutes')}</SelectItem>
                    <SelectItem value="30">30 {t('minutes')}</SelectItem>
                    <SelectItem value="60">1 {t('hour')}</SelectItem>
                    <SelectItem value="120">2 {t('hours')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('sessionTimeoutDesc')}</p>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => navigate('/change-password')}
                  className="w-full dark:border-gray-600 dark:text-white flex items-center justify-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  {t('changePassword')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}