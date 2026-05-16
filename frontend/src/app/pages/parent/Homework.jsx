import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { api } from '../../lib/api';

export function ParentHomework() {
  const { t } = useTranslation();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setLoading(true);
        const data = await api.parents.getChildrenHomework();
        // data is a flat array — group by studentOid
        const flat = Array.isArray(data) ? data : [];

        const map = new Map();
        flat.forEach(hw => {
          if (!map.has(hw.studentOid)) {
            map.set(hw.studentOid, { studentOid: hw.studentOid, studentName: hw.studentName, homework: [] });
          }
          map.get(hw.studentOid).homework.push(hw);
        });

        setChildren(Array.from(map.values()));
      } catch (err) {
        console.error('Failed to fetch homework:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, []);

  const normalizeStatus = (status) => status?.toLowerCase();

  const getStatusBadge = (status) => {
    switch (normalizeStatus(status)) {
      case 'pending':   return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">{t('pending')}</Badge>;
      case 'submitted': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">{t('submittedCount')}</Badge>;
      case 'graded':    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('gradedCount')}</Badge>;
      case 'overdue':   return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('overdueText')}</Badge>;
      default:          return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRowPriorityColor = (status) => {
    switch (normalizeStatus(status)) {
      case 'overdue':   return 'bg-red-50/50 dark:bg-red-900/10';
      case 'pending':   return 'bg-orange-50/50 dark:bg-orange-900/10';
      default:          return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('noHomeworkFound', 'No homework found.')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('homework')}</h1>
          <p className="text-muted-foreground">{t('trackChildrenAssignments')}</p>
        </div>
      </div>

      <Tabs defaultValue={children[0].studentOid} className="space-y-6">
        <TabsList>
          {children.map((child, index) => (
            <TabsTrigger key={`tab-${child.studentOid}-${index}`} value={child.studentOid}>
              {child.studentName}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child, index) => {
          const hw = child.homework;
          const pending   = hw.filter(h => normalizeStatus(h.status) === 'pending');
          const submitted = hw.filter(h => normalizeStatus(h.status) === 'submitted');
          const graded    = hw.filter(h => normalizeStatus(h.status) === 'graded');
          const overdue   = hw.filter(h => normalizeStatus(h.status) === 'overdue');

          return (
            <TabsContent key={`content-${child.studentOid}-${index}`} value={child.studentOid} className="space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{t('overdueText')}</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdue.length}</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                    {hw.map((item, idx) => (
                      <div
                        key={`hw-${child.studentOid}-${idx}`}
                        className={`p-6 hover:bg-muted/30 transition-colors ${getRowPriorityColor(item.status)}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-medium text-foreground">{item.title}</h4>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span className="capitalize">{item.subjectName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t('dueDate')}: {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              {item.grade != null && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  {t('gradeColLabel')} {item.grade}/{item.totalMarks}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Overdue Alert */}
              {overdue.length > 0 && (
                <Card className="border-none shadow-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-red-900 dark:text-red-300">{t('overdueAssignmentsTitle')}</h4>
                        <p className="text-sm text-red-800 dark:text-red-400">
                          {child.studentName} {t('overdueAssignmentMsg')} ({overdue.length})
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