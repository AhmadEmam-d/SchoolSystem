import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Eye, EyeOff, User, Phone, ArrowLeft, ArrowRight, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function AdminSignup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === 'ar';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    schoolName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    login('admin');
    navigate('/admin/dashboard');
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const inputClass = (extra = '') =>
    `block w-full py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-background text-foreground placeholder:text-muted-foreground ${extra}`;

  const InputField = ({ id, name, type, value, placeholder, icon: Icon, required = true }) => (
    <div className="relative">
      <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass(isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3')}
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/admin-login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <BackIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{t('backToAdminLogin')}</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg bg-blue-600">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2 mb-8">
          <h2 className="text-center text-3xl font-bold text-foreground">
            {t('createAdminAccount')}
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            {t('createAdminAccountDesc')}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-purple-100 dark:border-purple-900/50 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                    {t('fullNameLabel')}
                  </label>
                  <InputField id="fullName" name="fullName" type="text" value={formData.fullName} placeholder="" icon={User} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    {t('emailAddress')}
                  </label>
                  <InputField id="email" name="email" type="email" value={formData.email} placeholder="admin@edusmart.com" icon={Mail} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                    {t('phoneNumber')}
                  </label>
                  <InputField id="phone" name="phone" type="tel" value={formData.phone} placeholder="+20 123 456 7890" icon={Phone} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="schoolName" className="block text-sm font-medium text-foreground">
                    {t('schoolNameLabel')}
                  </label>
                  <InputField id="schoolName" name="schoolName" type="text" value={formData.schoolName} placeholder="" icon={Building} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('enterPasswordPlaceholder')}
                      className={inputClass(isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                    >
                      {showPassword
                        ? <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        : <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                    {t('confirmPasswordLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t('confirmNewPasswordPlaceholder')}
                      className={inputClass(isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                    >
                      {showConfirmPassword
                        ? <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        : <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium shadow-lg"
                >
                  {t('createAccount')}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">{t('alreadyHaveAccount')}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link to="/admin-login">
                    <Button variant="outline" className="w-full border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-blue-600">
                      {t('signInBtn')}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
