import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddSubject() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(t('nameRequired') || 'Subject name is required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.subjects.create({ name: formData.name });
      if (response.success || response.oid) {
        toast.success(t('subjectAddedSuccess') || 'Subject added successfully');
        navigate('/admin/subjects');
      } else {
        toast.error(response.message || t('errorAddingSubject') || 'Failed to add subject');
      }
    } catch (error) {
      toast.error(t('errorAddingSubject') || 'Failed to add subject');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/admin/subjects')}>
            <ArrowLeft size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
          <div style={styles.headerIcon}>
            <BookOpen size={20} color="white" />
          </div>
          <div>
            <h1 style={styles.title}>{t('AddNewSubject') || 'Add New Subject'}</h1>
            <p style={styles.subtitle}>
              {t('addNewSubjectDesc') || 'Fill in the details to create a subject'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Subject Info */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>{t('subjectInformation') || 'Subject Information'}</p>

            <Field label={t('subjectName') || 'Subject Name'} required>
              <div style={styles.inputWrapper}>
                <BookOpen size={15} style={{ ...styles.inputIcon, ...(isRTL ? styles.inputIconRTL : {}) }} />
                <input
                  style={{ ...styles.input, ...(isRTL ? styles.inputRTL : {}) }}
                  name="name"
                  placeholder={t('subjectPlaceholder') || 'e.g. Mathematics'}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <p style={styles.helpText}>
                {t('subjectNameHelp') || 'Enter the official name of the academic subject.'}
              </p>
            </Field>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              disabled={submitting}
              onClick={() => navigate('/admin/subjects')}
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving') || 'Saving...'}</>
                : <><Save size={15} /> {t('saveSubject') || 'Save Subject'}</>
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
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  helpText: {
    margin: '6px 0 0',
    fontSize: '12px',
    color: '#94a3b8',
    fontStyle: 'italic',
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