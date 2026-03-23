import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

// ─── Session-storage helpers ──────────────────────────────────────────────────
const CTX_KEY = 'pwdRecoveryCtx';

function loadRecoveryCtx() {
  try {
    const raw = sessionStorage.getItem(CTX_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
// ─────────────────────────────────────────────────────────────────────────────

export function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const savedCtx = loadRecoveryCtx();
  const contact = location.state?.contact ?? '';
  const method = location.state?.method ?? 'email';
  const from = location.state?.from ?? savedCtx?.from ?? 'login';
  const returnTo = location.state?.returnTo ?? savedCtx?.returnTo ?? '/login';

  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!contact) {
      navigate('/forgot-password', {
        replace: true,
        state: { from, returnTo },
      });
    }
  }, [contact, from, returnTo, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    setVerificationCode(newCode);
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${lastIndex}`)?.focus();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError(t('enterVerificationCode'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/new-password', {
        state: { contact, method, verified: true, from, returnTo },
      });
    }, 1500);
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setVerificationCode(['', '', '', '', '', '']);
    document.getElementById('code-0')?.focus();
  };

  const handleBack = () => {
    navigate('/forgot-password', { state: { from, returnTo } });
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <BackIcon className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform rtl:group-hover:translate-x-[2px]" />
          <span className="text-sm font-medium">
            {from === 'account' ? t('backToChangePassword') : t('backToLogin')}
          </span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 space-y-2"
        >
          <h2 className="text-4xl font-bold text-foreground">
            {t('verifyCodeTitle')}
          </h2>
          <p className="text-base text-muted-foreground">
            {t('codeSentTo')}
          </p>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {method === 'email' ? '📧' : '📱'} {contact}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4 text-center">
                    {t('enterVerificationCode')}
                  </label>
                  {/* Always LTR for code inputs */}
                  <div className="flex gap-3 justify-center" dir="ltr" onPaste={handlePaste}>
                    {verificationCode.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-border focus:border-blue-500 focus:ring-blue-500/20'
                        } ${digit ? 'bg-blue-50 dark:bg-blue-900/20 text-foreground' : 'bg-background text-foreground'}`}
                        required
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      />
                    ))}
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm text-red-600 text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('verifying')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      {t('verifyCode')}
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-card text-muted-foreground">
                      {t('didntReceiveCode')}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`h-5 w-5 ${countdown > 0 ? '' : 'hover:rotate-180 transition-transform duration-500'}`} />
                    {countdown > 0 ? (
                      <span>{t('resendCodeIn')} {countdown}{t('seconds')}</span>
                    ) : (
                      <span>{t('resendCode')}</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      {t('securityTip')}
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {t('securityTipText')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          {t('verificationCodeExpiry')}
        </motion.p>
      </div>
    </div>
  );
}
