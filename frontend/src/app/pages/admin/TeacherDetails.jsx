import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  ArrowLeft,
  Edit,
  Mail,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5073/api';

export function TeacherDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Teacher from API
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_BASE_URL}/Teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setTeacher(data.data);
        } else {
          toast.error(data.messages?.EN || 'Failed to load teacher');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  // No data
  if (!teacher) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <p>{t('noData')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subject = teacher.subjects?.[0];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/teachers')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold">{t('viewDetails')}</h1>
            <p className="text-gray-500 mt-1">{teacher.fullName}</p>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/admin/teachers/edit/${teacher.oid}`)}
        >
          <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('edit')}
        </Button>
      </div>

      {/* Avatar */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-3xl">
              {teacher.fullName?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-bold">{teacher.fullName}</h2>

            <div className="flex gap-4 mt-2 text-gray-500">

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {teacher.email}
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <Badge>{subject?.name || 'No Subject'}</Badge>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalClasses')}</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <GraduationCap />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalStudents')}</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <GraduationCap />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('avgPerformance')}</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
            <BookOpen />
          </CardContent>
        </Card>

      </div> */}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('personalInformation')}</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium">{teacher.fullName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{teacher.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p className="font-medium">{teacher.phone}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Subject</label>
            <p className="font-medium">{subject?.name || 'No Subject'}</p>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}