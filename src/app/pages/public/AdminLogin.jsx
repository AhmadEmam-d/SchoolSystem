import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTranslation } from 'react-i18next';

export function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const isRTL = i18n.language === 'ar';

  useEffect(() => { logout(); }, [logout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login('admin');
    navigate('/admin/dashboard');
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <BackIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{t('backToRoleSelection')}</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-center text-3xl font-bold text-foreground mb-2">
            {t('adminLoginTitle')}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('adminLoginDesc')}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('emailOrPhoneLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="admin@edusmart.com"
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('enterPasswordPlaceholder')}
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </div>

                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-border rounded"
                    />
                    <label htmlFor="remember-me" className="text-sm text-foreground">
                      {t('rememberMe')}
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500">
                    {t('forgotPassword')}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium shadow-lg"
                >
                  {t('signInBtn')}
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
                  <Link to="/admin-signup">
                    <Button variant="outline" className="w-full border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      {t('createAdminAccount')}
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