import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Shield, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "https://localhost:7179/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

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
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("كل الحقول مطلوبة");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("الباسورد لازم يكون 8 حروف على الأقل");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("الباسورد غير متطابق");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/Profile/change-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("CHANGE PASSWORD:", data);

      if (res.ok && data.success) {
        toast.success("تم تغيير كلمة المرور ✅");

        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        navigate(-1);
      } else {
        toast.error(data?.errors?.[0] || "فشل تغيير كلمة المرور");
      }

    } catch (err) {
      console.error(err);
      toast.error("حصل خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(`/${user?.role}/profile`);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const inputClass = (extra = '') =>
    `w-full py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${extra}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* BACK */}
        <button onClick={handleBack} className="flex items-center gap-2 mb-6">
          <BackIcon className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">

          {/* HEADER */}
          <div className="bg-blue-600 px-6 py-8 text-white flex items-center gap-4">
            <Shield />
            <div>
              <h1 className="text-xl font-bold">Change Password</h1>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* CURRENT */}
            <div>
              <label>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={inputClass()}
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* NEW */}
            <div>
              <label>New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={inputClass()}
              />
            </div>

            {/* CONFIRM */}
            <div>
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass()}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
              >
                {loading ? "Saving..." : "Update Password"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border rounded-lg"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}