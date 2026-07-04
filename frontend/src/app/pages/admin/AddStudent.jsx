import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    classOid: '',
    parentOid: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clsRes, parRes] = await Promise.all([
          api.classes.getAll(),
          api.parents.getAll()
        ]);
        setClasses(clsRes || []);
        setParents(parRes || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classOid) return toast.error('Select class');
    if (!formData.parentOid) return toast.error('Select parent');

    setLoading(true);
    try {
      const studentData = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        classOid: formData.classOid,
        parentOid: formData.parentOid,
        address: formData.address?.trim() || null
      };

      const { ok, data } = await api.students.create(studentData);

      if (ok && data.success) {
        toast.success('Student added successfully');
        navigate('/admin/students');
      } else {
        if (data.errors?.length > 0) {
          data.errors.forEach(err => toast.error(err));
        } else {
          toast.error(data.message || 'Failed to add student');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title}>Add New Student</h1>
            <p style={styles.subtitle}>Fill in the details below to enroll a new student</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section: Personal Info */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Personal Information</p>
            <div style={styles.grid2}>
              <Field label="Full Name" required>
                <input
                  style={styles.input}
                  name="fullName"
                  placeholder="e.g. Ahmed Mohamed"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Gender" required>
                <select style={styles.input} name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <Field label="Date of Birth" required>
                <input
                  style={styles.input}
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Phone Number">
                <input
                  style={styles.input}
                  name="phone"
                  placeholder="e.g. 01012345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <Field label="Email Address">
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="e.g. student@school.com"
                value={formData.email}
                onChange={handleChange}
              />
            </Field>

            <Field label="Address">
              <textarea
                style={{ ...styles.input, resize: 'vertical', minHeight: '80px' }}
                name="address"
                placeholder="Street, City..."
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </Field>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Section: Academic Info */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Academic & Family</p>
            <div style={styles.grid2}>
              <Field label="Class" required>
                <select style={styles.input} name="classOid" value={formData.classOid} onChange={handleChange} required>
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.oid} value={c.oid}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Parent / Guardian" required>
                <select style={styles.input} name="parentOid" value={formData.parentOid} onChange={handleChange} required>
                  <option value="">Select Parent</option>
                  {parents.map(p => (
                    <option key={p.oid} value={p.oid}>
                      {p.fatherName} — {p.phone}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/admin/students')}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.spinner} /> Saving...
                </span>
              ) : (
                'Add Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Small helper component for label + field
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
    maxWidth: '720px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '28px 32px',
    borderBottom: '1px solid #f1f5f9',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)',
  },
  headerIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#64748b',
  },
  section: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
    gap: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 13px',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '0 32px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px 32px 28px',
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
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
};