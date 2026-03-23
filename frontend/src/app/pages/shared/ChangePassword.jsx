import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Shield, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const CTX_KEY = 'pwdRecoveryCtx';

function saveRecoveryCtx(ctx) {
  try { sessionStorage.setItem(CTX_KEY, JSON.stringify(ctx)); } catch { /* ignore */ }
}

export function ChangePassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error(t('allFieldsRequired'));
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error(t('passwordMinLengthMsg'));
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success(t('passwordUpdatedSuccess'));
      setLoading(false);
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      navigate(-1);
    }, 1000);
  };

  const handleBack = () => navigate(`/${user?.role}/profile`);

  const handleForgotPassword = () => {
    const ctx = { from: 'account', returnTo: '/change-password' };
    saveRecoveryCtx(ctx);
    navigate('/forgot-password', { state: ctx });
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const inputClass = (extra = '') =>
    `w-full py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground placeholder:text-muted-foreground transition-colors ${extra}`;

  const PasswordField = ({ id, name, label, value, show, onToggle, hint }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock
          className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${
            isRTL ? 'right-3' : 'left-3'
          }`}
        />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handleChange}
          className={inputClass(isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10')}
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
            isRTL ? 'left-3' : 'right-3'
          }`}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <BackIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{t('back')}</span>
        </button>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className={`space-y-0.5 ${isRTL ? 'text-right' : ''}`}>
                <h1 className="text-xl font-bold text-white">
                  {t('changePasswordTitle')}
                </h1>
                <p className="text-blue-100 text-sm">
                  {user?.email || user?.name || t('changePasswordSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Current Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-foreground"
              >
                {t('currentPassword')}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${
                    isRTL ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={inputClass(isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10')}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`mt-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1 ${
                  isRTL ? 'flex-row-reverse mr-auto' : 'ml-auto'
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                {t('forgotPassword')}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* New Password */}
            <PasswordField
              id="newPassword"
              name="newPassword"
              label={t('newPassword')}
              value={formData.newPassword}
              show={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              hint={t('passwordMinLengthMsg')}
            />

            {/* Confirm New Password */}
            <PasswordField
              id="confirmNewPassword"
              name="confirmNewPassword"
              label={t('confirmNewPassword')}
              value={formData.confirmNewPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Action Buttons */}
            <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? t('updating') : t('updatePassword')}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-border rounded-lg text-foreground hover:bg-muted font-medium transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
