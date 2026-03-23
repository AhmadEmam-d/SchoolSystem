import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function ParentHomework() {
  const { t } = useTranslation();

  const childrenHomework = [
    {
      childId: 's1',
      childName: 'Bart Simpson',
      homework: [
        { id: '1', title: 'Math Worksheet Chapter 5', subject: 'Mathematics', dueDate: '2026-03-10', status: 'pending' },
        { id: '2', title: 'Science Lab Report', subject: 'Science', dueDate: '2026-03-12', status: 'pending' },
        { id: '3', title: 'History Essay', subject: 'History', dueDate: '2026-03-15', status: 'submitted' },
        { id: '4', title: 'English Reading', subject: 'English', dueDate: '2026-03-05', status: 'graded', grade: 85 },
      ]
    },
    {
      childId: 's3',
      childName: 'Lisa Simpson',
      homework: [
        { id: '5', title: 'Advanced Math Problems', subject: 'Mathematics', dueDate: '2026-03-10', status: 'submitted' },
        { id: '6', title: 'Science Project', subject: 'Science', dueDate: '2026-03-12', status: 'submitted' },
        { id: '7', title: 'History Research', subject: 'History', dueDate: '2026-03-05', status: 'graded', grade: 100 },
      ]
    },
  ];

  const getPriorityColor = (dueDate, status) => {
    if (status !== 'pending') return 'bg-muted text-muted-foreground';
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (days <= 2) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return t('pending');
      case 'submitted': return t('submittedCount');
      case 'graded': return t('gradedCount');
      default: return status;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">{t('pending')}</Badge>;
      case 'submitted': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">{t('submittedCount')}</Badge>;
      case 'graded': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('gradedCount')}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('homework')}</h1>
          <p className="text-muted-foreground">{t('trackChildrenAssignments')}</p>
        </div>
      </div>

      <Tabs defaultValue={childrenHomework[0].childId} className="space-y-6">
        <TabsList>
          {childrenHomework.map(child => (
            <TabsTrigger key={child.childId} value={child.childId}>
              {child.childName}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenHomework.map(child => {
          const pending = child.homework.filter(h => h.status === 'pending');
          const submitted = child.homework.filter(h => h.status === 'submitted');
          const graded = child.homework.filter(h => h.status === 'graded');

          return (
            <TabsContent key={child.childId} value={child.childId} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{t('pending')}</div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pending.length}</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{t('submittedCount')}</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{submitted.length}</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{t('gradedCount')}</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{graded.length}</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Homework List */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('allAssignmentsTitle')}</CardTitle>
                  <CardDescription>{t('allAssignmentsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {child.homework.map(hw => (
                      <div key={hw.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-medium text-foreground">{hw.title}</h4>
                              {getStatusBadge(hw.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{hw.subject}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{t('dueDate')}: {new Date(hw.dueDate).toLocaleDateString()}</span>
                              </div>
                              {hw.grade && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  {t('gradeColLabel')} {hw.grade}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getPriorityColor(hw.dueDate, hw.status)}>
                            {hw.status === 'pending' && Math.ceil((new Date(hw.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0
                              ? t('overdueText')
                              : getStatusLabel(hw.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {pending.some(hw => new Date(hw.dueDate) < new Date()) && (
                <Card className="border-none shadow-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-red-900 dark:text-red-300">{t('overdueAssignmentsTitle')}</h4>
                        <p className="text-sm text-red-800 dark:text-red-400">
                          {child.childName} {t('overdueAssignmentMsg')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
