import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Edit, 
  Calendar, 
  Loader2, 
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { api } from '@/app/lib/api';
import { toast } from "sonner";

export function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        const response = await api.classes.getById(id);
        
        // معالجة البيانات بناءً على هيكلية الـ API الخاص بك
        if (response && response.success && response.data) {
          setClassData(response.data);
        } else if (response && response.oid) {
          // في حال كانت البيانات تأتي مباشرة بدون غلاف success
          setClassData(response);
        } else {
          toast.error(t('classNotFound'));
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClassDetails();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <p className="text-muted-foreground animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-xl inline-block">
          <LayoutDashboard className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">{t('classNotFound')}</h2>
          <p className="text-muted-foreground">{t('classNotFoundDesc') || 'The requested class record could not be found.'}</p>
        </div>
        <br />
        <Button onClick={() => navigate('/admin/classes')} variant="outline">
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {t('backToClasses')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/classes')}
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              {classData.name}
              <span className="text-sm font-normal bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                {t('grade')} {classData.level}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">{t('classDetailsDesc')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/classes/edit/${classData.oid}`)}>
            <Edit className="h-4 w-4 mr-2" /> {t('editClassBtn')}
          </Button>
          <Button onClick={() => navigate('/admin/timetable')}>
            <Calendar className="h-4 w-4 mr-2" /> {t('timetableBtn')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-purple-500" />
                {t('classInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t('className')}</span>
                <span className="font-medium">{classData.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t('level')}</span>
                <span className="font-medium">{classData.level}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t('oid')}</span>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  {classData.oid}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Clock className="h-4 w-4" />
                <span>{t('createdAt')}: {new Date(classData.createdAt).toLocaleDateString(i18n.language)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Users className="h-6 w-6 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {classData.students?.length || 0}
                </p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider">
                  {t('studentsNum')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <BookOpen className="h-6 w-6 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {classData.sections?.length || 0}
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-wider">
                  {t('sectionsNum')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Placeholder for future lists (Students/Teachers) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full min-h-[400px] flex flex-col items-center justify-center border-dashed">
            <Users className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">{t('noAdditionalData')}</h3>
            <p className="text-sm text-muted-foreground/60">{t('studentListSoon')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}