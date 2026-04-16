import React, { useEffect, useState } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import { useTranslation } from 'react-i18next';
import { api } from '../../../app/lib/api';

export function AdminExamResults() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const exams = await api.exams.getAll();
      const summaryData = await api.exams.getSummary();

      // هنجيب results لكل exam
      let allResults = [];

      for (let exam of exams) {
        const res = await api.exams.getResults(exam.oid);

        if (res && res.length > 0) {
          res.forEach(r => {
            allResults.push({
              examName: exam.name,
              subject: exam.subjectName,
              class: exam.className,
              date: exam.date,
              studentsCount: exam.studentsCount,
              averageScore: r.averageScore || 0,
              highestScore: r.highestScore || 0,
              lowestScore: r.lowestScore || 0,
              status: exam.status
            });
          });
        } else {
          // لو مفيش results
          allResults.push({
            examName: exam.name,
            subject: exam.subjectName,
            class: exam.className,
            date: exam.date,
            studentsCount: exam.studentsCount,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            status: exam.status
          });
        }
      }

      setResults(allResults);
      setSummary(summaryData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResults = results.filter(r =>
    r.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Grading':
        return <Badge className="bg-yellow-100 text-yellow-800">Grading</Badge>;
      case 'Pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">

      {/* 🔥 Summary فوق */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card>
            <CardHeader><CardTitle>Total Exams</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{summary.totalExams}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.completedExams}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Students</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Average</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{summary.overallAverage}%</div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* 🔍 Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 📊 Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredResults.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.examName}</TableCell>
                  <TableCell>{r.subject}</TableCell>
                  <TableCell>{r.class}</TableCell>
                  <TableCell>{new Date(r.date).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>{r.studentsCount}</TableCell>
                  <TableCell>{r.averageScore}</TableCell>
                  <TableCell>{r.highestScore}</TableCell>
                  <TableCell>{r.lowestScore}</TableCell>
                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResults.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No Results
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}