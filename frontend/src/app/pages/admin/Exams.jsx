import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const EXAMS = [
  { id: 1, subject: 'Mathematics', class: '10-A', date: '2023-12-15', time: '09:00 AM', duration: '2h', type: 'Final' },
  { id: 2, subject: 'Science', class: '10-B', date: '2023-12-16', time: '10:30 AM', duration: '1.5h', type: 'Midterm' },
  { id: 3, subject: 'History', class: '8-A', date: '2023-12-18', time: '01:00 PM', duration: '1h', type: 'Quiz' },
  { id: 4, subject: 'English', class: '10-A', date: '2023-12-20', time: '09:00 AM', duration: '2h', type: 'Final' },
  { id: 5, subject: 'Art', class: '9-C', date: '2023-12-22', time: '11:00 AM', duration: '3h', type: 'Practical' },
];

export function AdminExams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const filteredExams = EXAMS.filter(exam =>
    (exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.class.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || exam.type.toLowerCase() === filterType) &&
    (filterClass === 'all' || exam.class === filterClass)
  );

  const getTranslatedSubject = (subject) => {
    switch (subject) {
      case 'Mathematics': return t('math');
      case 'Science': return t('science');
      case 'History': return t('history');
      case 'English': return t('english');
      case 'Art': return t('art');
      default: return subject;
    }
  };

  const getTranslatedType = (type) => {
    switch (type.toLowerCase()) {
      case 'final': return t('examTypeFinal');
      case 'midterm': return t('examTypeMidterm');
      case 'quiz': return t('examTypeQuiz');
      case 'practical': return t('examTypePractical');
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('examsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('examsPageDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('totalScheduled'), value: EXAMS.length, color: 'text-gray-900 dark:text-white' },
          { label: t('upcomingNext7Days'), value: 3, color: 'text-blue-600 dark:text-blue-400' },
          { label: t('completed'), value: 12, color: 'text-gray-400 dark:text-gray-500' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="dark:text-white">{t('upcomingExamsTitle')}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full md:w-64">
                <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-500`} />
                <Input
                  placeholder={t('searchBySubjectOrClass')}
                  className={`${isRTL ? 'pr-8' : 'pl-8'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select onValueChange={(val) => setFilterType(val)} defaultValue="all">
                <SelectTrigger className="w-[140px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder={t('filterTypeBtn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allTypes')}</SelectItem>
                  <SelectItem value="final">{t('examTypeFinal')}</SelectItem>
                  <SelectItem value="midterm">{t('examTypeMidterm')}</SelectItem>
                  <SelectItem value="quiz">{t('examTypeQuiz')}</SelectItem>
                  <SelectItem value="practical">{t('examTypePractical')}</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => setFilterClass(val)} defaultValue="all">
                <SelectTrigger className="w-[140px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder={t('filterClassBtn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allClasses')}</SelectItem>
                  <SelectItem value="10-A">10-A</SelectItem>
                  <SelectItem value="10-B">10-B</SelectItem>
                  <SelectItem value="8-A">8-A</SelectItem>
                  <SelectItem value="9-C">9-C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-400">{t('subjectCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('class')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('dateCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('timeCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('durationCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('typeCol')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id} className="dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{getTranslatedSubject(exam.subject)}</TableCell>
                  <TableCell className="dark:text-gray-300">{exam.class}</TableCell>
                  <TableCell className="dark:text-gray-300">
                    {new Date(exam.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{exam.time}</TableCell>
                  <TableCell className="dark:text-gray-300">{exam.duration}</TableCell>
                  <TableCell>
                    <Badge variant={
                      exam.type === 'Final' ? 'destructive' :
                      exam.type === 'Midterm' ? 'default' : 'secondary'
                    }>
                      {getTranslatedType(exam.type)}
                    </Badge>
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
