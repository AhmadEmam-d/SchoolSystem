import React, { useEffect, useState } from 'react';
import {
  Users, BarChart3, TrendingUp, TrendingDown, Award, Download
} from 'lucide-react';
import { api } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

// ── helpers ──────────────────────────────────────────────────────────────────

function gradeLevel(avg) {
  if (avg >= 85) return { label: 'Excellent', cls: 'badge-high' };
  if (avg >= 70) return { label: 'Good', cls: 'badge-mid' };
  return { label: 'Weak', cls: 'badge-low' };
}

const BAR_COLORS = ['#3266ad', '#1D9E75', '#3266ad', '#E24B4A', '#BA7517', '#1D9E75'];

const RANK_STYLE = {
  1: { background: '#FAEEDA', color: '#633806' },
  2: { background: '#F1EFE8', color: '#444441' },
  3: { background: '#FAECE7', color: '#993C1D' },
};

// ── components ───────────────────────────────────────────────────────────────

function MetricCard({ title, value, icon, variant }) {
  const bg = { blue: '#E6F1FB', teal: '#E1F5EE', green: '#EAF3DE', amber: '#FAEEDA' }[variant];
  const fill = { blue: '#185FA5', teal: '#0F6E56', green: '#3B6D11', amber: '#854F0B' }[variant];

  return (
    <div className="metric-card">
      <div>
        <p className="metric-label">{title}</p>
        <p className="metric-value">{value}</p>
      </div>
      <div className="metric-icon" style={{ background: bg }}>
        {React.cloneElement(icon, { size: 18, color: fill })}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p>{label}</p>
      <strong>{payload[0].value}%</strong>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

export function GradesReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.getGrades()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-state">Loading...</div>;
  if (!data) return <div className="page-state error">Failed to load data</div>;

  const metrics = [
    { title: 'Total Students', value: data.totalStudents, icon: <Users />, variant: 'blue' },
    { title: 'Average Grade', value: `${data.averageGrade}%`, icon: <BarChart3 />, variant: 'teal' },
    { title: 'Top Performers', value: data.topPerformersCount, icon: <TrendingUp />, variant: 'green' },
    { title: 'Needs Support', value: data.totalStudents - data.topPerformersCount, icon: <TrendingDown />, variant: 'amber' },
  ];

  const chartData = data.subjectPerformance.map(s => ({
    name: s.subjectName,
    average: s.average,
  }));

  const handleExport = () => {
    const rows = [
      ['Subject', 'Average', 'Highest', 'Lowest'],
      ...data.subjectPerformance.map(s => [s.subjectName, s.average, s.highest, s.lowest]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grades_report.csv';
    link.click();
  };

  return (
    <>
      <style>{styles}</style>

      <div className="grades-report">

        {/* Header */}
        <div className="report-header">
          <div>
            <h1 className="report-title">Grades Report</h1>
            <p className="report-sub">Overview of student performance by subject</p>
          </div>

          <button className="export-btn" onClick={handleExport}>
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          {metrics.map(m => <MetricCard key={m.title} {...m} />)}
        </div>

        {/* Chart */}
        <div className="card">
          <div className="card-header">Average Grades by Subject</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="average">
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subjects Table */}
        <div className="card">
          <div className="card-header">Subjects Performance</div>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Average</th>
                <th>Highest</th>
                <th>Lowest</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {data.subjectPerformance.map((s, i) => {
                const { label, cls } = gradeLevel(s.average);
                return (
                  <tr key={i}>
                    <td>{s.subjectName}</td>
                    <td>{s.average}%</td>
                    <td>{s.highest}%</td>
                    <td>{s.lowest}%</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Top Students */}
        <div className="card">
          <div className="card-header">Top Students</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Class</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {data.topStudents.map((s, i) => {
                const rank = i + 1;
                const style = RANK_STYLE[rank] || {};
                return (
                  <tr key={i}>
                    <td><span style={style}>{rank}</span></td>
                    <td>{s.studentName}</td>
                    <td>{s.className}</td>
                    <td>{s.average}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

// ── styles ───────────────────────────────────────────────────────────────────

const styles = `
.grades-report { padding:20px; font-family:sans-serif }
.report-header { display:flex; justify-content:space-between; margin-bottom:20px }
.metric-card { background:#f5f5f5; padding:10px; border-radius:8px; display:flex; justify-content:space-between }
.metrics-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px }
.card { background:#fff; padding:15px; border-radius:10px; margin-bottom:15px }
table { width:100%; border-collapse:collapse }
th,td { padding:8px; border-bottom:1px solid #ddd; text-align:left }
.badge-high { color:green }
.badge-mid { color:orange }
.badge-low { color:red }
`;