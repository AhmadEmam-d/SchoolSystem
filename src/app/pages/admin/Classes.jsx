import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/app/components/ui/button";
import { Plus, Users, BookOpen, Edit } from "lucide-react";

export function AdminClasses() {
  const { classes } = useMockData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('classesPage')}</h1>
          <p className="text-muted-foreground">{t('classesPageDesc')}</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/admin/classes/add')}>
          <Plus className="h-4 w-4" /> {t('addClassBtn')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div key={cls.id} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{cls.name}</h3>
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                {t('grade')} {cls.gradeLevel}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm">{cls.studentIds.length} {t('studentsNum')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm">{cls.teacherIds.length} {t('teachersAssigned')}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-300" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                  {t('viewDetails')}
                </Button>
                <Button variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-300" onClick={() => navigate('/admin/timetable')}>
                  {t('timetableBtn')}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 dark:border-gray-600 dark:text-gray-300"
                onClick={() => navigate(`/admin/classes/edit/${cls.id}`)}
              >
                <Edit className="h-4 w-4" />
                {t('editClassBtn')}
              </Button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
              <BookOpen className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground">{t('noClassesYet')}</h3>
            <p className="text-muted-foreground">{t('createClassToStart')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
