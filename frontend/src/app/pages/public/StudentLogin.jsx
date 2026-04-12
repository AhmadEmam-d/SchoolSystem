import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isRTL = i18n.language === 'ar';

  const API_BASE_URL = 'https://localhost:7179/api';


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        email: email,
        password: password,
        role: 3
      });

      if (response.data.success) {
        const { token, userId, fullName, role, redirectTo } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userRole', role);
        
        login('student', { userId, fullName, token });
        navigate('/student/dashboard');
      } else {
        setError(response.data.messages?.AR || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors[0]);
      } else {
        setError('حدث خطأ في الاتصال بالخادم');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { from: 'login', returnTo: '/student-login' },
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
          <div className="h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-center text-3xl font-bold text-foreground mb-2">
            {t('studentLoginTitle')}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('studentLoginDesc')}
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-lg text-sm text-center">
            {error}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@school.com"
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                      className={`block w-full py-3 border border-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded" />
                    <label htmlFor="remember-me" className="text-sm text-foreground">{t('rememberMe')}</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium shadow-lg">
                  {loading ? 'جاري التسجيل...' : t('signInBtn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}