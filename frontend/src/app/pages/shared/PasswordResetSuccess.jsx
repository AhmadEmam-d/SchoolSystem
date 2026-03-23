import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Shield, Settings } from 'lucide-react';
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

function clearRecoveryCtx() {
  try { sessionStorage.removeItem(CTX_KEY); } catch { /* ignore */ }
}
// ─────────────────────────────────────────────────────────────────────────────

export function PasswordResetSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const savedCtx = loadRecoveryCtx();
  const from = location.state?.from ?? savedCtx?.from ?? 'login';
  const stateReturnTo = location.state?.returnTo ?? savedCtx?.returnTo ?? '/login';
  const isAccountCtx = from === 'account';

  const redirectTarget = isAccountCtx ? '/change-password' : (stateReturnTo || '/login');

  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    clearRecoveryCtx();
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate(redirectTarget, { replace: true });
    }
  }, [countdown, navigate, redirectTarget]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProceed = () => navigate(redirectTarget, { replace: true });

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-14 w-14 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 bg-emerald-400 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 space-y-2"
        >
          <h2 className="text-4xl font-bold text-foreground">
            {t('passwordResetSuccessTitle')}
          </h2>
          <p className="text-base text-muted-foreground">
            {t('passwordChangedSuccessMsg')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-green-100 dark:border-green-900/50 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Success message */}
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                        {isAccountCtx ? (
                          <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-green-900 dark:text-green-200">
                        {t('allSet')}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {isAccountCtx ? t('canReturnNow') : t('canSignInNow')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto redirect countdown */}
                <div className="text-center py-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {isAccountCtx
                      ? t('redirectingToChangePassword')
                      : t('redirectingToLogin')}{' '}
                  </p>
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full"
                  >
                    <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {countdown}
                    </span>
                  </motion.div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleProceed}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isAccountCtx ? t('returnToChangePasswordNow') : t('goToLoginNow')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </span>
                </Button>

                {/* Security tips */}
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="text-xs font-semibold text-foreground">
                    {t('securityTipsTitle')}
                  </h4>
                  <ul className="space-y-2">
                    {[t('securityTip1'), t('securityTip2'), t('securityTip3')].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          {t('didntRequestChange')}
        </motion.p>
      </div>
    </div>
  );
}
