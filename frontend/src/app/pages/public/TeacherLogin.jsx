import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTranslation } from 'react-i18next';

export function TeacherLogin() {
  const { login, isAuthenticated, logout } = useAuth(); // أضف logout هنا
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isRTL = i18n.language === 'ar';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'Teacher' || userRole === 'teacher') {
        navigate('/teacher/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ email, password });
      
      console.log('Login result:', result); // للتأكد من النتيجة

      if (result && result.success) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'Teacher' || userRole === 'teacher') {
          navigate('/teacher/dashboard');
        } else {
          setError(t('invalidTeacherAccount'));
          logout(); // تسجيل خروج إذا لم يكن المعلم
        }
      } else {
        setError(result?.message || t('loginFailed'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { from: 'login', returnTo: '/teacher-login' },
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
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-center text-3xl font-bold text-foreground mb-2">
            {t('teacherLoginTitle')}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('teacherLoginDesc')}
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@school.com"
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-border rounded"
                    />
                    <label htmlFor="remember-me" className="text-sm text-foreground">{t('rememberMe')}</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('signingIn')}
                    </div>
                  ) : (
                    t('signInBtn')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}