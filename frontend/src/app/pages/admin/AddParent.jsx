import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddParent() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fatherName || !formData.motherName || !formData.email || !formData.phone) {
      toast.error(t('completeAllFields') || 'Please complete all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.parents.create(formData);
      if (response.success) {
        toast.success(t('parentAddedSuccess') || 'Parent added successfully');
        navigate('/admin/parents');
      } else {
        toast.error(response.message || t('errorAddingParent') || 'Failed to add parent');
      }
    } catch (error) {
      toast.error(t('connectionError') || 'Server connection error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/admin/parents')}>
            <ArrowLeft size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
          <div style={styles.headerIcon}>
            <User size={20} color="white" />
          </div>
          <div>
            <h1 style={styles.title}>{t('AddNewParent') || 'Add New Parent'}</h1>
            <p style={styles.subtitle}>
              {t('addNewParentDesc') || 'Fill in the details to create a parent account'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Personal Info */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>{t('personalInformation') || 'Personal Information'}</p>

            <div style={styles.grid2}>
              <Field label={t('fatherName') || 'Father Name'} required>
                <div style={styles.inputWrapper}>
                  <User size={15} style={{ ...styles.inputIcon, ...(isRTL ? styles.inputIconRTL : {}) }} />
                  <input
                    style={{ ...styles.input, ...(isRTL ? styles.inputRTL : {}) }}
                    name="fatherName"
                    placeholder={t('placeholderFatherName') || 'e.g. Ahmed Mohamed'}
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Field>

              <Field label={t('motherName') || 'Mother Name'} required>
                <div style={styles.inputWrapper}>
                  <User size={15} style={{ ...styles.inputIcon, ...(isRTL ? styles.inputIconRTL : {}) }} />
                  <input
                    style={{ ...styles.input, ...(isRTL ? styles.inputRTL : {}) }}
                    name="motherName"
                    placeholder={t('placeholderMotherName') || 'e.g. Sara Ahmed'}
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Field>
            </div>

            <div style={styles.grid2}>
              <Field label={t('email') || 'Email Address'} required>
                <div style={styles.inputWrapper}>
                  <Mail size={15} style={{ ...styles.inputIcon, ...(isRTL ? styles.inputIconRTL : {}) }} />
                  <input
                    style={{ ...styles.input, ...(isRTL ? styles.inputRTL : {}) }}
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Field>

              <Field label={t('phone') || 'Phone Number'} required>
                <div style={styles.inputWrapper}>
                  <Phone size={15} style={{ ...styles.inputIcon, ...(isRTL ? styles.inputIconRTL : {}) }} />
                  <input
                    style={{ ...styles.input, ...(isRTL ? styles.inputRTL : {}) }}
                    type="tel"
                    name="phone"
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              disabled={submitting}
              onClick={() => navigate('/admin/parents')}
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving') || 'Saving...'}</>
                : <><Save size={15} /> {t('saveParent') || 'Add Parent'}</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={styles.label}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '32px 16px',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)',
  },
  backBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    flexShrink: 0,
  },
  headerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '11px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '19px',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    margin: '3px 0 0',
    fontSize: '13px',
    color: '#64748b',
  },
  section: {
    padding: '22px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionLabel: {
    margin: 0,
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  inputIconRTL: {
    left: 'auto',
    right: '12px',
  },
  input: {
    width: '100%',
    padding: '10px 13px 10px 36px',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputRTL: {
    padding: '10px 36px 10px 13px',
    textAlign: 'right',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '18px 28px 24px',
    borderTop: '1px solid #f1f5f9',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '10px 22px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
};