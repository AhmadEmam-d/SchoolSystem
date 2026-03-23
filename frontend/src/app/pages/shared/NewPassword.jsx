import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Key, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { toast } from 'sonner';

// ─── Session-storage helpers ──────────────────────────────────────────────────
const CTX_KEY = 'pwdRecoveryCtx';

function loadRecoveryCtx() {
  try {
    const raw = sessionStorage.getItem(CTX_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearRecoveryCtx() {
  try { sessionStorage.removeItem(CTX_KEY); } catch { /* ignore */ }
}
// ─────────────────────────────────────────────────────────────────────────────

export function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const savedCtx = loadRecoveryCtx();
  const contact = location.state?.contact ?? '';
  const method = location.state?.method ?? 'email';
  const verified = location.state?.verified ?? false;
  const from = location.state?.from ?? savedCtx?.from ?? 'login';
  const returnTo = location.state?.returnTo ?? savedCtx?.returnTo ?? '/login';
  const isAccountCtx = from === 'account';

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (!verified || !contact) {
      navigate('/forgot-password', {
        replace: true,
        state: { from, returnTo },
      });
    }
  }, [verified, contact, from, returnTo, navigate]);

  useEffect(() => {
    const password = formData.newPassword;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.newPassword]);

  const validatePassword = (password) => {
    if (!password) return t('passwordRequired');
    if (password.length < 8) return t('passwordMinLength');
    if (!/[A-Z]/.test(password)) return t('passwordNeedsUppercase');
    if (!/[a-z]/.test(password)) return t('passwordNeedsLowercase');
    if (!/\d/.test(password)) return t('passwordNeedsNumber');
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    if (newPassword) {
      setErrors({ ...errors, newPassword: validatePassword(newPassword) });
    } else {
      setErrors({ ...errors, newPassword: '' });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    if (confirmPassword && confirmPassword !== formData.newPassword) {
      setErrors({ ...errors, confirmPassword: t('passwordsDoNotMatch') });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      setErrors({ ...errors, newPassword: newPasswordError });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: t('passwordsDoNotMatch') });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearRecoveryCtx();
      if (isAccountCtx) {
        toast.success(t('passwordResetSuccessMsg'));
        navigate('/change-password', { replace: true });
      } else {
        navigate('/password-reset-success', {
          replace: true,
          state: { from, returnTo },
        });
      }
    }, 1500);
  };

  const handleBack = () => {
    navigate('/verify-code', { state: { contact, method, from, returnTo } });
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return t('weak');
    if (passwordStrength < 70) return t('medium');
    return t('strong');
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const inputBase = (hasError) =>
    `block w-full py-3.5 border-2 rounded-lg focus:outline-none focus:ring-4 transition-all bg-background text-foreground placeholder:text-muted-foreground ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-border focus:border-blue-500 focus:ring-blue-500/20'
    }`;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <BackIcon className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform rtl:group-hover:translate-x-[2px]" />
          <span className="text-sm font-medium">{t('back')}</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
            <Key className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 space-y-2"
        >
          <h2 className="text-4xl font-bold text-foreground">
            {t('newPasswordTitle')}
          </h2>
          <p className="text-base text-muted-foreground">
            {t('newPasswordDesc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground">
                    {t('newPassword')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handlePasswordChange}
                      className={`${inputBase(errors.newPassword)} ${isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12'}`}
                      placeholder={t('enterNewPassword')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>

                  {formData.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('passwordStrengthLabel')}
                        </span>
                        <span className={`text-xs font-bold ${
                          passwordStrength < 40 ? 'text-red-600' :
                          passwordStrength < 70 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full ${getStrengthColor()} transition-colors`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {errors.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-2 flex items-start gap-2 text-sm text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{errors.newPassword}</span>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`${inputBase(errors.confirmPassword)} ${isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12'}`}
                      placeholder={t('confirmNewPasswordPlaceholder')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-2 flex items-start gap-2 text-sm text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </motion.div>
                  )}

                  {formData.confirmPassword && !errors.confirmPassword && formData.newPassword === formData.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-2 flex items-center gap-2 text-sm text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t('passwordsMatch')}</span>
                    </motion.div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                    {t('passwordRequirementsTitle')}
                  </h4>
                  <ul className="space-y-1.5">
                    {[
                      { check: formData.newPassword.length >= 8, label: t('atLeast8Chars') },
                      { check: /[A-Z]/.test(formData.newPassword), label: t('oneUppercase') },
                      { check: /[a-z]/.test(formData.newPassword), label: t('oneLowercase') },
                      { check: /\d/.test(formData.newPassword), label: t('oneNumber') },
                    ].map((req, i) => (
                      <li key={i} className={`text-xs flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${req.check ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${req.check ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !!errors.newPassword || !!errors.confirmPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('resettingPassword')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      {t('submitBtn')}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          {t('useStrongPassword')}
        </motion.p>
      </div>
    </div>
  );
}
