import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [parents, setParents] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    classOid: '',
    sectionOid: '',
    parentOid: ''
  });

  // ✅ Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [clsRes, secRes, parRes] = await Promise.all([
          api.classes.getAll(),
          fetch(`https://localhost:7179/api/Sections`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }).then(res => res.json()),
          api.parents.getAll()
        ]);

        setClasses(clsRes || []);
        setSections(secRes?.data || []);
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

  // ✅ Filter sections by class
  useEffect(() => {
    if (formData.classOid) {

      const filtered = sections.filter(
        s =>
          s.classOid === formData.classOid ||
          s.class?.oid === formData.classOid
      );

      setFilteredSections(filtered);

      setFormData(prev => ({
        ...prev,
        sectionOid: ''
      }));

    } else {
      setFilteredSections([]);
    }
  }, [formData.classOid, sections]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classOid) return toast.error('Select class');
    if (!formData.sectionOid) return toast.error('Select section');
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
        sectionOid: formData.sectionOid,
        parentOid: formData.parentOid,
        address: formData.address?.trim() || null
      };

      console.log("🚀 Sending:", studentData);

      const { ok, data } = await api.students.create(studentData);

      console.log("📥 Response:", data);

      if (ok && data.success) {
        toast.success('Student added successfully');
        navigate('/admin/students');
      } else {
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach(err => {
            console.error("❌ Backend Error:", err);
            toast.error(err);
          });
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error('Failed to add student');
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="fullName" placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange} />

        <input name="email" placeholder="Email"
          value={formData.email}
          onChange={handleChange} />

        <input name="phone" placeholder="Phone"
          value={formData.phone}
          onChange={handleChange} />

        <input type="date" name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange} />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <textarea name="address" placeholder="Address"
          value={formData.address}
          onChange={handleChange} />

        {/* Class */}
        <select name="classOid" value={formData.classOid} onChange={handleChange}>
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.oid} value={c.oid}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Section */}
        <select
          name="sectionOid"
          value={formData.sectionOid}
          onChange={handleChange}
          disabled={!formData.classOid}
        >
          <option value="">Select Section</option>

          {filteredSections.length === 0 && (
            <option disabled>No Sections Available</option>
          )}

          {filteredSections.map(s => (
            <option key={s.oid} value={s.oid}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Parent */}
        <select name="parentOid" value={formData.parentOid} onChange={handleChange}>
          <option value="">Select Parent</option>
          {parents.map(p => (
            <option key={p.oid} value={p.oid}>
              {p.fatherName} - {p.phone}
            </option>
          ))}
        </select>

        <button disabled={loading}>
          {loading ? 'Saving...' : 'Add'}
        </button>

      </form>
    </div>
  );
}