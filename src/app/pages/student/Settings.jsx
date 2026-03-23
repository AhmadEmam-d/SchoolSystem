import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, Bell, Lock, Globe, Sun, Moon, KeyRound } from 'lucide-react';
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

export function StudentSettings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    homeworkReminders: true,
    gradeUpdates: true,
    twoFactorAuth: false,
  });

  const handleSave = () => {
    toast.success(t('settingsSaved'));
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
    toast.success(t('languageUpdated'));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(t('themeUpdated'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('manageAccountSettings')}</p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
          <Save className="h-4 w-4" />
          {t('save')}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
          <TabsTrigger value="general">{t('generalSettings')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notificationSettings')}</TabsTrigger>
          <TabsTrigger value="security">{t('securityTab')}</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
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

          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-indigo-600" />
                <CardTitle className="dark:text-white">{t('appearance')}</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">{t('customizeAppDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">{t('theme')}</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
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
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600" />
                <CardTitle className="dark:text-white">{t('notificationPreferences')}</CardTitle>
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
                  <Label className="dark:text-gray-200">{t('homeworkReminders')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('homeworkRemindersTeacherDesc')}</p>
                </div>
                <Switch
                  checked={settings.homeworkReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, homeworkReminders: checked })}
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
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                <CardTitle className="dark:text-white">{t('securityTab')}</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">{t('manageAccountSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="pt-4">
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
