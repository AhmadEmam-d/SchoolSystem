import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { api } from '../../lib/api';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  User
} from 'lucide-react';

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.students.getById(id);
      
      setStudent(res || null); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (!student) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            {t('noData') || "No Data Found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = student.fullName?.split(' ').map(n => n[0]).join('').toUpperCase();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/students')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{t('viewDetails') || "Student Details"}</h1>
            <p className="text-gray-500 mt-1">{student.fullName}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/students/edit/${student.oid}`)}>
          <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('edit') || "Edit"}
        </Button>
      </div>

      {/* PROFILE CARD */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{student.fullName}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Mail size={14} />
                {student.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone size={14} />
                {student.phone || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                {student.gender || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(student.dateOfBirth)}
              </div>
              {student.address && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {student.address}
                </div>
              )}
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 self-start">Active</Badge>
        </CardContent>
      </Card>

      {/* ACADEMIC + PARENT */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Academic Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-500" />
              Academic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Class</span>
              <span className="font-medium">{student.class?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Level</span>
              <span className="font-medium">{student.class?.level || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Section</span>
              <span className="font-medium">{student.section?.name || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Parent Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Father</span>
              <span className="font-medium">{student.parent?.fatherName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mother</span>
              <span className="font-medium">{student.parent?.motherName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{student.parent?.phone || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}