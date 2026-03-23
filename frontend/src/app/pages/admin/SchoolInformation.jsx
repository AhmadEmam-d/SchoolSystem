import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, School, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

export function SchoolInformation() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    schoolName: 'Edu Smart Academy',
    schoolNameAr: 'أكاديمية إديو سمارت',
    email: 'admin@edusmart.edu',
    phone: '+1 (555) 123-4567',
    website: 'www.edusmart.edu',
    address: '123 Education Street, Learning City, LC 12345',
    addressAr: '٢٣٣ شارع التعليم، مدينة التعلم، LC ٢٣٣٤٥',
    timezone: 'America/New_York',
    principalName: 'Dr. John Smith',
    principalNameAr: 'د. جون سميث',
    establishedYear: '2005',
    studentCapacity: '1000',
    description: 'A leading educational institution dedicated to excellence in learning and character development.',
    descriptionAr: 'مؤسسة تعليمية رائدة مكرسة للتميز في التعلم وتنمية الشخصية.',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(t('schoolInformationSaved'));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/settings')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('schoolInformation')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('schoolInformationDesc')}</p>
        </div>
        <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {t('save')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-purple-600" />
              <CardTitle className="dark:text-white">{t('basicInformation')}</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">{t('basicInformationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="dark:text-gray-200">{t('schoolName')} (English) *</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolNameAr" className="dark:text-gray-200">{t('schoolName')} (العربية) *</Label>
                <Input
                  id="schoolNameAr"
                  name="schoolNameAr"
                  value={formData.schoolNameAr}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principalName" className="dark:text-gray-200">{t('principalName')} (English)</Label>
                <Input
                  id="principalName"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalNameAr" className="dark:text-gray-200">{t('principalName')} (العربية)</Label>
                <Input
                  id="principalNameAr"
                  name="principalNameAr"
                  value={formData.principalNameAr}
                  onChange={handleChange}
                  dir="rtl"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishedYear" className="dark:text-gray-200">{t('establishedYear')}</Label>
                <Input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentCapacity" className="dark:text-gray-200">{t('studentCapacity')}</Label>
                <Input
                  id="studentCapacity"
                  name="studentCapacity"
                  type="number"
                  value={formData.studentCapacity}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-gray-200">{t('description')} (English)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionAr" className="dark:text-gray-200">{t('description')} (العربية)</Label>
              <Textarea
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                rows={3}
                dir="rtl"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <CardTitle className="dark:text-white">{t('contactInformation')}</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">{t('contactInformationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('email')} *
                  </div>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('phone')} *
                  </div>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t('website')}
                  </div>
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('address')} (English) *
                </div>
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressAr" className="dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('address')} (العربية) *
                </div>
              </Label>
              <Textarea
                id="addressAr"
                name="addressAr"
                value={formData.addressAr}
                onChange={handleChange}
                required
                rows={2}
                dir="rtl"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <CardTitle className="dark:text-white">{t('regionalSettings')}</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">{t('regionalSettingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="dark:text-gray-200">{t('timezone')}</Label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                  <SelectItem value="Asia/Riyadh">Arabia Standard Time (AST)</SelectItem>
                  <SelectItem value="Africa/Cairo">Eastern European Time (EET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/settings')}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            {t('saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
}