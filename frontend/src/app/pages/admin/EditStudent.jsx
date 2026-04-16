import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { api } from '../../lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    admissionNumber: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phone: '',
    classOid: '',
    sectionOid: '',
    parentOid: ''
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const student = await api.students.getById(id);

        if (student) {
          setFormData({
            admissionNumber: student.admissionNumber || '',
            fullName: student.fullName || '',
            gender: student.gender || '',
            dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
            address: student.address || '',
            email: student.email || '',
            phone: student.phone || '',
            classOid: student.classOid || '',
            sectionOid: student.sectionOid || '',
            parentOid: student.parentOid || ''
          });
        }
      } catch (err) {
        toast.error("Error loading student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.students.update(id, formData);
      toast.success("Saved successfully ✅");
      navigate('/admin/students');
    } catch (err) {
      toast.error("Error saving ❌");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/students')}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      {/* STUDENT ID (شكل واضح) */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Student ID</p>
          <p className="font-mono text-sm break-all text-blue-600">
            {id}
          </p>
        </CardContent>
      </Card>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <Card>
          <CardHeader>
            <CardTitle>Student Info</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">

           

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium">Gender</label>
              <Input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Male / Female"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

          

          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          <Save className="mr-2" />
          Save Changes
        </Button>

      </form>
    </div>
  );
}