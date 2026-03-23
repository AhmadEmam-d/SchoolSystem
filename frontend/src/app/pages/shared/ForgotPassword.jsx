import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Send, GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// ─── Session-storage helpers ──────────────────────────────────────────────────
const CTX_KEY = 'pwdRecoveryCtx';

function saveRecoveryCtx(ctx) {
  try { sessionStorage.setItem(CTX_KEY, JSON.stringify(ctx)); } catch { /* ignore */ }
}

function loadRecoveryCtx() {
  try {
    const raw = sessionStorage.getItem(CTX_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearRecoveryCtx() {
  try { sessionStorage.removeItem(CTX_KEY); } catch { /* ignore */ }
}
// ─────────────────────────────────────────────────────────────────────────────

export function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('email');
  const [contact, setContact] = useState('');
  const isRTL = i18n.language === 'ar';

  const savedCtx = loadRecoveryCtx();
  const from = location.state?.from ?? savedCtx?.from ?? 'login';
  const returnTo = location.state?.returnTo ?? savedCtx?.returnTo ?? '/login';
  const isAccountCtx = from === 'account';

  useEffect(() => {
    saveRecoveryCtx({ from, returnTo });
  }, [from, returnTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact.trim()) {
      toast.error(t('allFieldsRequired'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t('sendVerificationCode'));
      navigate('/verify-code', {
        state: { contact, method, from, returnTo },
      });
    }, 1500);
  };

  const handleBack = () => {
    navigate(returnTo);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <BackIcon className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform rtl:group-hover:translate-x-[2px]" />
          <span className="text-sm font-medium">
            {isAccountCtx ? t('backToChangePassword') : t('backToLogin')}
          </span>
        </motion.button>

        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-5">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-9 w-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('forgotPasswordTitle')}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            {t('forgotPasswordSubtitle')}
          </p>

          {isAccountCtx && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {t('forgotCurrentPassword') || 'Forgot Current Password'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-xl border border-border p-8"
        >
          {/* Method Selector */}
          <div className="flex gap-3 mb-7">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                method === 'email'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-muted text-muted-foreground border-border hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              <Mail className="h-4 w-4" />
              {t('emailMethod')}
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                method === 'phone'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-muted text-muted-foreground border-border hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              <Phone className="h-4 w-4" />
              {t('phoneMethod')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                {method === 'email' ? t('emailAddress') : t('phoneNumber')}
              </label>
              <div className="relative">
                {method === 'email' ? (
                  <Mail
                    className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${
                      isRTL ? 'right-3' : 'left-3'
                    }`}
                  />
                ) : (
                  <Phone
                    className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${
                      isRTL ? 'right-3' : 'left-3'
                    }`}
                  />
                )}
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`w-full py-3 border-2 border-border rounded-xl focus:ring-0 focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition-colors ${
                    isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'
                  }`}
                  placeholder={method === 'email' ? 'your@email.com' : '+20 123 456 7890'}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 px-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {t('sendVerificationCode')}
                </>
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {method === 'email' ? t('emailVerificationInfo') : t('smsVerificationInfo')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
