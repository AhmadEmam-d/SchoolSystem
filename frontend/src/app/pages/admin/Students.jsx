import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL'); // 🔥 fix
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ================= FETCH =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.students.getAll();
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ================= ACTIONS =================
  const handleViewStudent = (id) => navigate(`/admin/students/${id}`);
  const handleEditStudent = (id) => navigate(`/admin/students/edit/${id}`);

  const handleDeleteClick = async (student) => {
    if (!confirm("Delete student?")) return;
    try {
      await api.students.delete(student.oid);
      setStudents(prev => prev.filter(s => s.oid !== student.oid));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredStudents = students.filter(s => {
    const searchMatch =
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const gradeMatch =
      gradeFilter === 'ALL' || s.class?.level === gradeFilter;

    return searchMatch && gradeMatch;
  });

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase();

  // 🔥 FIX parent display
  const getParentDisplay = (parentOid) => {
    if (!parentOid) return "No Parent";

    return (
      <span className="text-xs text-gray-500">
        ID: {parentOid.slice(0, 6)}...
      </span>
    );
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('studentsPage')}</h1>
          <p className="text-gray-500">{t('studentsPageDesc')}</p>
        </div>

        <Button
          onClick={() => navigate('/admin/students/add')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus size={16} className="mr-2" />
          {t('addStudentBtnLabel')}
        </Button>
      </div>

      {/* CARD */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between gap-4">

          <CardTitle>
            {t('allStudentsTitle')} ({filteredStudents.length})
          </CardTitle>

          <div className="flex gap-3">

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder={t('searchStudentsPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* 🔥 FIXED SELECT */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-44">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder={t('grade')} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Grades</SelectItem>
                <SelectItem value="6th">Grade 6</SelectItem>
                <SelectItem value="7th">Grade 7</SelectItem>
                <SelectItem value="8th">Grade 8</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Parent</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.oid} className="border-b hover:bg-gray-50">

                  {/* NAME */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold">
                      {getInitials(student.fullName)}
                    </div>
                    <div>
                      <div className="font-medium">{student.fullName}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </div>
                  </td>

                  {/* GRADE */}
                  <td className="px-6 py-4">
                    <Badge variant="outline">
                      {student.class?.level || 'N/A'}
                    </Badge>
                  </td>

                  {/* 🔥 FIXED PARENT */}
                  <td className="px-6 py-4">
                    {getParentDisplay(student.parentOid)}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">

                      <button onClick={() => handleViewStudent(student.oid)} className="p-2 hover:bg-blue-50 text-blue-600 rounded">
                        <Eye size={16} />
                      </button>

                      <button onClick={() => handleEditStudent(student.oid)} className="p-2 hover:bg-orange-50 text-orange-600 rounded">
                        <Edit size={16} />
                      </button>

                      <button onClick={() => handleDeleteClick(student)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </CardContent>
      </Card>

    </div>
  );
}