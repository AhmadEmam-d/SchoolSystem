import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTranslation } from 'react-i18next';

export function ParentLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const isRTL = i18n.language === 'ar';

  React.useEffect(() => { logout(); }, [logout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login('parent');
    navigate('/parent/dashboard');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { from: 'login', returnTo: '/parent-login' },
    });
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
          <div className="h-16 w-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-center text-3xl font-bold text-foreground mb-2">
            {t('parentLoginTitle')}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('parentLoginDesc')}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium text-foreground mb-2">
                    {t('emailOrPhoneLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="emailOrPhone"
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="parent@edusmart.com"
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
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
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
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
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-border rounded" />
                    <label htmlFor="remember-me" className="text-sm text-foreground">{t('rememberMe')}</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base font-medium shadow-lg">
                  {t('signInBtn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}