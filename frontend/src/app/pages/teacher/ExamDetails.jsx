import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText, Users, Edit, BarChart, Loader2, MapPin, Target, Paperclip, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../lib/api';

const API_BASE_URL = "http://edusmarrt.runasp.net/api";

// ─── Helper: حجم الفايل ──────────────────────────────────────────────────────
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// ─── Helper: أيقونة حسب نوع الفايل ─────────────────────────────────────────
const getFileIcon = (fileType) => {
  if (fileType?.includes('pdf')) return '📄';
  if (fileType?.includes('image')) return '🖼️';
  if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
  return '📎';
};

export function ExamDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        const data = await api.exams.getById(id);
        if (data) {
          setExam(data);
        } else {
          toast.error(t('examNotFound'));
          navigate('/teacher/exams');
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error(t('failedToLoadExamDetails'));
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [id, navigate, t]);

  const getDynamicStatus = (examDate) => {
    const now = new Date().setHours(0, 0, 0, 0);
    const eDate = new Date(examDate).setHours(0, 0, 0, 0);
    if (eDate > now) return 'Upcoming';
    if (eDate === now) return 'Ongoing';
    return 'Completed';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500">{t('loading')}...</p>
      </div>
    );
  }

  if (!exam) return null;

  const currentStatus = getDynamicStatus(exam.date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/exams')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {exam.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
              {exam.type}
            </Badge>
            <span>•</span>
            <span>{t('examDetailsAndInfo')}</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/teacher/exams/edit/${id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          {t('edit')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description & Instructions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t('description')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {exam.description || t('noDescription')}
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('instructions')}</h3>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg text-amber-900 text-sm italic">
                  {exam.instructions || t('noInstructions')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Passing Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MapPin size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('location')}</p>
                    <p className="font-bold">{exam.room || t('notAssigned')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><Target size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('passingScore')}</p>
                    <p className="font-bold">{exam.passingScore} / {exam.maxScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Materials ─────────────────────────────────────────────────────── */}
          {exam.materials && exam.materials.length > 0 && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  {t('examMaterials') || 'Exam Materials'}
                  <Badge variant="secondary" className="ml-auto">
                    {exam.materials.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exam.materials.map((material) => (
                    <div
                      key={material.oid}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      {/* أيقونة الفايل */}
                      <span className="text-xl shrink-0">
                        {getFileIcon(material.fileType)}
                      </span>

                      {/* اسم وحجم الفايل */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{material.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(material.fileSize)}
                        </p>
                      </div>

                      {/* زرار تحميل */}
                      <a
                        href={`${API_BASE_URL}${material.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={material.name}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t('overview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SidebarItem icon={<Calendar />} label={t('date')} value={new Date(exam.date).toLocaleDateString()} />
              <SidebarItem icon={<Clock />} label={t('startTime')} value={exam.startTime?.substring(0, 5)} />
              <SidebarItem icon={<Clock />} label={t('duration')} value={exam.duration?.substring(0, 5)} />
              <SidebarItem icon={<FileText />} label={t('maxScore')} value={exam.maxScore} />
              <SidebarItem icon={<Users />} label={t('students')} value={exam.studentsCount || 0} isLast />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gray-50">
            <CardHeader>
              <CardTitle>{t('status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`w-full justify-center py-2 text-sm ${getStatusStyle(currentStatus)}`}>
                {t(currentStatus.toLowerCase())}
              </Badge>
              <div className="mt-4 space-y-2">
                {currentStatus === 'Completed' && (
                  <Button className="w-full bg-indigo-600" onClick={() => navigate(`/teacher/exams/${id}/results`)}>
                    <BarChart className="mr-2 h-4 w-4" />
                    {t('manageResults')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SidebarItem({ icon, label, value, isLast }) {
  return (
    <div className={`flex items-center justify-between py-2 ${!isLast ? 'border-b' : ''}`}>
      <div className="flex items-center gap-2 text-gray-500">
        {React.cloneElement(icon, { size: 16 })}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}

function getStatusStyle(status) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700';
  }
}