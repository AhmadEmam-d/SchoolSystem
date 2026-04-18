import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

export function StudentsSummaryReport() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.reports.getStudentsSummary();

        if (data) {
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 تجهيز الطلاب
  const students = useMemo(() => {
    if (!report?.students) return [];

    return report.students.map(s => ({
      id: s.oid,
      name: s.fullName,
      class: s.className,
      gender: s.gender,
      status: s.status.toLowerCase(),
      attendance: s.attendance,
      performance: s.performance,
      enrollmentDate: s.enrollmentDate
    }));
  }, [report]);

  // 🔥 Stats
  const stats = useMemo(() => {
    if (!report) return null;

    return {
      total: report.totalStudents,
      active: report.activeStudents,
      avgAttendance: report.avgAttendance,
      avgPerformance: report.avgPerformance
    };
  }, [report]);

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>No Data</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-3xl font-bold">
        {isRTL ? 'تقرير الطلاب' : 'Students Report'}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-card rounded">
          <p>{isRTL ? 'إجمالي الطلاب' : 'Total'}</p>
          <h2 className="text-2xl">{stats.total}</h2>
        </div>

        <div className="p-4 bg-card rounded">
          <p>{isRTL ? 'النشط' : 'Active'}</p>
          <h2 className="text-2xl">{stats.active}</h2>
        </div>

        <div className="p-4 bg-card rounded">
          <p>{isRTL ? 'الحضور' : 'Attendance'}</p>
          <h2 className="text-2xl">{stats.avgAttendance}%</h2>
        </div>

        <div className="p-4 bg-card rounded">
          <p>{isRTL ? 'الأداء' : 'Performance'}</p>
          <h2 className="text-2xl">{stats.avgPerformance}%</h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-card rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="p-3">{isRTL ? 'الاسم' : 'Name'}</th>
              <th className="p-3">{isRTL ? 'الصف' : 'Class'}</th>
              <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="p-3">{isRTL ? 'الحضور' : 'Attendance'}</th>
              <th className="p-3">{isRTL ? 'الأداء' : 'Performance'}</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.class}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{s.attendance}%</td>
                <td className="p-3">{s.performance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}