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
  GraduationCap,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
useEffect(() => {
  const fetchStudent = async () => {
    try {
      const res = await api.students.getById(id);
      setStudent(res || null); // ✅ FIX
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchStudent();
}, [id]);

  // ================= LOADING =================
  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // ================= NO DATA =================
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

  // ================= UI =================
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
            <h1 className="text-3xl font-bold">
              {t('viewDetails') || "Student Details"}
            </h1>
            <p className="text-gray-500 mt-1">
              {student.fullName}
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/admin/students/edit/${student.oid}`)}
        >
          <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('edit') || "Edit"}
        </Button>
      </div>

      {/* INFO CARD */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold">
            {student.fullName?.split(' ').map(n => n[0]).join('')}
          </div>

          <div>
            <h2 className="text-xl font-bold">{student.fullName}</h2>

            <div className="flex gap-4 mt-2 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Mail size={14} />
                {student.email}
              </div>

              <div className="flex items-center gap-1">
                <GraduationCap size={14} />
                {student.class?.level || "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">GPA</p>
            <p className="text-2xl font-bold">
              {student.gpa?.toFixed(2) || "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Attendance</p>
            <p className="text-2xl font-bold">
              {student.attendance || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Status</p>
            <Badge className="mt-2 bg-green-100 text-green-700">
              Active
            </Badge>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}