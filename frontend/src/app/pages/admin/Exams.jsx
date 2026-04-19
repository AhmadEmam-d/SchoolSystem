import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { api } from '../../lib/api';

export function AdminExams() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [exams, setExams] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchData = async () => {
    try {
      const examsData = await api.exams.getAll();
      const summaryData = await api.exams.getSummary();

      setExams(examsData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExams = exams.filter(exam =>
    exam.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || exam.type.toLowerCase() === filterType)
  );

  return (
    <div className="space-y-6">

      {/* 🔥 SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-gray-500">Total Exams</div>
            <div className="text-2xl font-bold">{summary?.totalExams || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {summary?.completedExams || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-gray-500">Grading</div>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.gradingExams || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-gray-500">Students</div>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.totalStudents || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔍 FILTER */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 justify-between">
            <CardTitle>Exams</CardTitle>

            <div className="flex gap-2">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4`} />
                <Input
                  placeholder="Search..."
                  className={`${isRTL ? 'pr-8' : 'pl-8'}`}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select onValueChange={setFilterType} defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="midterm">Midterm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* 📊 TABLE */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.oid}>
                  <TableCell>{exam.subjectName}</TableCell>
                  <TableCell>{exam.className}</TableCell>

                  <TableCell>
                    {new Date(exam.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{exam.startTime}</TableCell>
                  <TableCell>{exam.duration}</TableCell>

                  <TableCell>
                    <Badge>
                      {exam.status}
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