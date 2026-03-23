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

export function ParentSettings() {
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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground">{t('manageAccountSettings')}</p>
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
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle>{t('language')}</CardTitle>
              </div>
              <CardDescription>{t('languageChooseDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>{t('language')}</Label>
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

          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle>{t('appearance')}</CardTitle>
              </div>
              <CardDescription>{t('customizeAppDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>{t('theme')}</Label>
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
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle>{t('notificationPreferences')}</CardTitle>
              </div>
              <CardDescription>{t('manageNotificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                {
                  key: 'emailNotifications',
                  label: t('emailNotifications'),
                  desc: t('emailNotificationsDesc'),
                },
                {
                  key: 'pushNotifications',
                  label: t('pushNotifications'),
                  desc: t('pushNotificationsDesc'),
                },
                {
                  key: 'homeworkReminders',
                  label: t('homeworkReminders'),
                  desc: t('homeworkRemindersParentDesc'),
                },
                {
                  key: 'gradeUpdates',
                  label: t('gradeUpdatesLabel'),
                  desc: t('gradeUpdatesStudentDesc'),
                },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key]}
                    onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle>{t('securityTab')}</CardTitle>
              </div>
              <CardDescription>{t('manageAccountSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label>{t('twoFactorAuth')}</Label>
                  <p className="text-sm text-muted-foreground">{t('twoFactorAuthDesc')}</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate('/change-password')}
                  className="w-full flex items-center justify-center gap-2"
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
