import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Search, BookOpen, Users } from 'lucide-react';
import { SUBJECTS, TEACHERS, CLASSES } from '../../lib/mockData';

export function AdminSubjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getTeacherName = (id) => {
    return TEACHERS.find(tch => tch.id === id)?.name || t('unassigned');
  };

  const getClassCount = (subjectId) => {
    return CLASSES.filter(c => c.name.toLowerCase().includes(
      SUBJECTS.find(s => s.id === subjectId)?.name.toLowerCase() || ''
    )).length;
  };

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('subjectsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('subjectsPageDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/subjects/add')}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addSubjectBtnLabel')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('totalSubjectsCard'), value: SUBJECTS.length, icon: <BookOpen className="h-4 w-4 text-gray-400" /> },
          { label: t('totalClasses'), value: CLASSES.length, icon: <Users className="h-4 w-4 text-gray-400" /> },
          { label: t('teachersAssignedCard'), value: TEACHERS.length, icon: <Users className="h-4 w-4 text-gray-400" /> },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">{label}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">{t('allSubjectsTitle')}</CardTitle>
            <div className="relative w-64">
              <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-500`} />
              <Input
                placeholder={t('searchSubjectsPlaceholder')}
                className={`${isRTL ? 'pr-8' : 'pl-8'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-400">{t('subjectNameCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('departmentHeadCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('activeClassesCol')}</TableHead>
                <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id} className="dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{subject.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{getTeacherName(subject.teacherId)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {getClassCount(subject.id)} {t('classesLabel')}
                    </span>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark:text-gray-300"
                      onClick={() => navigate(`/admin/subjects/edit/${subject.id}`)}
                    >
                      {t('edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
