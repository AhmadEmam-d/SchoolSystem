import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2, User, Mail, Phone, BookOpen, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddTeacher() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subjectOids: []
  });

  useEffect(() => {
    api.subjects.getAll()
      .then(res => setSubjects(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => toast.error("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, []);

  const toggleSubject = (oid) => {
    setFormData(prev => ({
      ...prev,
      subjectOids: prev.subjectOids.includes(oid)
        ? prev.subjectOids.filter(id => id !== oid)
        : [...prev.subjectOids, oid]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please complete all required fields");
      return;
    }
    if (formData.subjectOids.length === 0) {
      toast.error("Select at least one subject");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        teacher: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subjectOids: formData.subjectOids
        }
      };
      const res = await api.teachers.create(payload);
      console.log("📥 Response:", JSON.stringify(res, null, 2));
      if (res?.success) {
        toast.success("Teacher added successfully");
        navigate('/admin/teachers');
      } else {
        toast.error(res?.messages?.EN || "Failed to add teacher");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite', width: 32, height: 32, color: '#6366f1' }} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/admin/teachers')}>
            <ArrowLeft size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
          <div style={styles.headerIcon}>
            <User size={20} color="white" />
          </div>
          <div>
            <h1 style={styles.title}>Add New Teacher</h1>
            <p style={styles.subtitle}>Fill in the details to create a teacher account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Personal Info */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Personal Information</p>

            <div style={styles.grid2}>
              <Field label="Full Name" required>
                <div style={styles.inputWrapper}>
                  <User size={15} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="e.g. Ahmed Mohamed"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </Field>

              <Field label="Phone Number" required>
                <div style={styles.inputWrapper}>
                  <Phone size={15} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="e.g. 01012345678"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </Field>
            </div>

            <Field label="Email Address" required>
              <div style={styles.inputWrapper}>
                <Mail size={15} style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type="email"
                  placeholder="e.g. teacher@school.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </Field>
          </div>

          <div style={styles.divider} />

          {/* Subjects */}
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={styles.sectionLabel}>Subjects</p>
              {formData.subjectOids.length > 0 && (
                <span style={styles.badge}>{formData.subjectOids.length} selected</span>
              )}
            </div>

            <div style={styles.subjectsGrid}>
              {subjects.map(s => {
                const selected = formData.subjectOids.includes(s.oid);
                return (
                  <button
                    key={s.oid}
                    type="button"
                    onClick={() => toggleSubject(s.oid)}
                    style={{
                      ...styles.subjectChip,
                      ...(selected ? styles.subjectChipSelected : {})
                    }}
                  >
                    {selected && <Check size={13} style={{ flexShrink: 0 }} />}
                    {s.name}
                  </button>
                );
              })}
              {subjects.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>No subjects available</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/admin/teachers')}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                : <><Save size={15} /> Add Teacher</>
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
  divider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '0 28px',
  },
  subjectsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  subjectChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: '500',
    borderRadius: '20px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  subjectChipSelected: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
    color: '#4f46e5',
  },
  badge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4f46e5',
    backgroundColor: '#eef2ff',
    padding: '3px 10px',
    borderRadius: '20px',
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