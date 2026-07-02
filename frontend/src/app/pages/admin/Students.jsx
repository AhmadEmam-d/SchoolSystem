import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Filter, Users, X } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

// ألوان أفاتار ثابتة لكل اسم (نفس الاسم دايمًا ياخد نفس اللون)
const AVATAR_PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
];

const getAvatarColor = (name = '') => {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
};

const GRADE_BADGE_STYLES = {
  '6th': 'border-sky-200 bg-sky-50 text-sky-700',
  '7th': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  '8th': 'border-amber-200 bg-amber-50 text-amber-700',
};

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [deletingOid, setDeletingOid] = useState(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ================= FETCH =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.students.getAll();
        const all = Array.isArray(res.data) ? res.data : [];
        setStudents(all.filter((s) => !s.isDeleted));
      } catch {
        toast.error(t('failedToLoadStudents') || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [t]);

  // ================= ACTIONS =================
  const handleViewStudent = (id) => navigate(`/admin/students/${id}`);
  const handleEditStudent = (id) => navigate(`/admin/students/edit/${id}`);

  const handleDeleteClick = async (student) => {
    if (!confirm(t('confirmDeleteStudent') || `Delete ${student.fullName}?`)) return;
    setDeletingOid(student.oid);
    try {
      const res = await api.students.delete(student.oid);
      if (res.success) {
        setStudents((prev) => prev.filter((s) => s.oid !== student.oid));
        toast.success(t('studentDeleted') || 'Student deleted');
      } else {
        toast.error(res.message || t('deleteFailed') || 'Delete failed');
      }
    } catch {
      toast.error(t('deleteFailed') || 'Delete failed');
    } finally {
      setDeletingOid(null);
    }
  };

  // ================= FILTER =================
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchTerm.toLowerCase();
      const searchMatch =
        s.fullName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
      const gradeMatch = gradeFilter === 'ALL' || s.class?.level === gradeFilter;
      return searchMatch && gradeMatch;
    });
  }, [students, searchTerm, gradeFilter]);

  const getInitials = (name) =>
    name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const getParentDisplay = (parentOid) => {
    if (!parentOid) {
      return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">
          {t('noParent') || 'No parent linked'}
        </span>
      );
    }
    return (
      <span className="font-mono text-xs text-gray-500">
        #{parentOid.slice(0, 6)}
      </span>
    );
  };

  const hasActiveFilters = searchTerm.trim() !== '' || gradeFilter !== 'ALL';
  const clearFilters = () => {
    setSearchTerm('');
    setGradeFilter('ALL');
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-gray-100" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
        </div>
        <Card className="shadow-lg">
          <CardContent className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('studentsPage')}
            </h1>
            <p className="text-sm text-gray-500">{t('studentsPageDesc')}</p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/admin/students/add')}
          className="bg-indigo-600 shadow-sm hover:bg-indigo-700"
        >
          <Plus size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
          {t('addStudentBtnLabel')}
        </Button>
      </div>

      {/* CARD */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col gap-4 border-b bg-gray-50/50 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {t('allStudentsTitle')}
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 font-medium">
              {filteredStudents.length}
            </Badge>
          </CardTitle>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isRTL ? 'right-3' : 'left-3'
                }`}
                size={16}
              />
              <Input
                placeholder={t('searchStudentsPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-64 ${isRTL ? 'pr-9 text-right' : 'pl-9'}`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* GRADE FILTER */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                <SelectValue placeholder={t('grade')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('allGrades') || 'All Grades'}</SelectItem>
                <SelectItem value="6th">{t('grade6') || 'Grade 6'}</SelectItem>
                <SelectItem value="7th">{t('grade7') || 'Grade 7'}</SelectItem>
                <SelectItem value="8th">{t('grade8') || 'Grade 8'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Users size={24} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {hasActiveFilters
                    ? t('noMatchingStudents') || 'No students match your filters'
                    : t('noStudentsYet') || 'No students yet'}
                </p>
                <p className="text-sm text-gray-500">
                  {hasActiveFilters
                    ? t('tryDifferentFilters') || 'Try a different search or grade filter'
                    : t('addFirstStudent') || 'Add your first student to get started'}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  {t('clearFilters') || 'Clear filters'}
                </Button>
              ) : (
                <Button size="sm" onClick={() => navigate('/admin/students/add')} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus size={14} className={isRTL ? 'ml-1.5' : 'mr-1.5'} />
                  {t('addStudentBtnLabel')}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className={`px-6 py-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('student') || 'Student'}
                    </th>
                    <th className={`px-6 py-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('grade') || 'Grade'}
                    </th>
                    <th className={`px-6 py-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('parent') || 'Parent'}
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      {t('actions') || 'Actions'}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.oid}
                      className={`transition-colors hover:bg-gray-50 ${
                        deletingOid === student.oid ? 'opacity-50' : ''
                      }`}
                    >
                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(
                              student.fullName
                            )}`}
                          >
                            {getInitials(student.fullName)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-gray-900">
                              {student.fullName}
                            </div>
                            <div className="truncate text-xs text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* GRADE */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={
                            GRADE_BADGE_STYLES[student.class?.level] ||
                            'border-gray-200 bg-gray-50 text-gray-500'
                          }
                        >
                          {student.class?.level || t('notAvailable') || 'N/A'}
                        </Badge>
                      </td>

                      {/* PARENT */}
                      <td className="px-6 py-4">{getParentDisplay(student.parentOid)}</td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleViewStudent(student.oid)}
                            title={t('view') || 'View'}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditStudent(student.oid)}
                            title={t('edit') || 'Edit'}
                            className="rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            disabled={deletingOid === student.oid}
                            title={t('delete') || 'Delete'}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}