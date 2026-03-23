import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Shield, CheckCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export function ResetPassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, method } = location.state || {};
  const isRTL = i18n.language === 'ar';
  
  const [step, setStep] = useState('verify');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if no contact info
  useEffect(() => {
    if (!contact) {
      navigate('/forgot-password');
    }
  }, [contact, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error(t('enterVerificationCode'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(t('verifyCode'));
      setLoading(false);
      setStep('reset');
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error(t('allFieldsRequired'));
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error(t('passwordMinLength'));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(t('passwordUpdatedSuccess'));
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    toast.success(t('sendVerificationCode'));
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
              step === 'verify' ? 'bg-indigo-600' : 'bg-green-600'
            }`}>
              {step === 'verify' ? (
                <Shield className="h-10 w-10 text-white" />
              ) : (
                <CheckCircle className="h-10 w-10 text-white" />
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {step === 'verify' ? t('verifyCode') : t('changePasswordTitle')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {step === 'verify' 
              ? `${t('codeSentTo')} ${method === 'email' ? '📧' : '📱'} ${contact}`
              : t('newPasswordDesc')
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {step === 'verify' ? (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                  {t('enterVerificationCode')}
                </label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : t('verifyCode')}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0}
                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className="h-5 w-5" />
                {countdown > 0 
                  ? `${t('resendCodeIn')} ${countdown}${t('seconds')}`
                  : t('resendCode')
                }
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('newPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('passwordMinLengthMsg')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : t('updatePassword')}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors mt-4"
          >
            <BackIcon className="h-5 w-5" />
            {t('backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
