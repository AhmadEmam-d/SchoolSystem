import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Clock, BookOpen, Users, User, MapPin,
  Hash, Calendar, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const DAY_COLORS = {
  Sunday:    'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400',
  Monday:    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  Tuesday:   'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400',
  Wednesday: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
  Thursday:  'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
  Friday:    'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-400',
  Saturday:  'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400',
};

const DAY_SELECTED = {
  Sunday:    'bg-rose-600 border-rose-600 text-white',
  Monday:    'bg-blue-600 border-blue-600 text-white',
  Tuesday:   'bg-violet-600 border-violet-600 text-white',
  Wednesday: 'bg-amber-500 border-amber-500 text-white',
  Thursday:  'bg-emerald-600 border-emerald-600 text-white',
  Friday:    'bg-sky-600 border-sky-600 text-white',
  Saturday:  'bg-orange-500 border-orange-500 text-white',
};

export function AddTimetable() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ─── Dropdown data ────────────────────────────────────────────────────────
  const [classes,  setClasses]  = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ─── Form state ───────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    classOid:   '',
    subjectOid: '',
    teacherOid: '',
    day:        '',
    startTime:  '',
    endTime:    '',
    room:       '',
    period:     '',
  });

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  // ─── Load dropdowns ───────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [cls, subj, teach] = await Promise.all([
          api.classes.getAll(),
          api.subjects.getAll(),
          api.teachers.getAll(),
        ]);
        setClasses(Array.isArray(cls)   ? cls   : cls?.data  ?? []);
        setSubjects(Array.isArray(subj)  ? subj  : subj?.data ?? []);
        setTeachers(Array.isArray(teach) ? teach : teach?.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const canSubmit =
    form.classOid && form.subjectOid && form.teacherOid &&
    form.day && form.startTime && form.endTime && form.period;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        classOid:   form.classOid,
        subjectOid: form.subjectOid,
        teacherOid: form.teacherOid,
        day:        form.day,
        startTime:  form.startTime,
        endTime:    form.endTime,
        room:       form.room,
        period:     parseInt(form.period, 10),
      };
      const res = await api.timetable.create(payload);
      
      if (res?.success === false) {
        throw new Error(res?.messages?.EN || res?.message || 'Failed to create timetable entry');
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/timetable'), 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getLabel = (arr, oid, field = 'name') =>
    arr.find(i => (i.oid ?? i.id) === oid)?.[field] ?? '—';

  const selectedClass   = classes.find(c  => (c.oid  ?? c.id) === form.classOid);
  const selectedSubject = subjects.find(s => (s.oid  ?? s.id) === form.subjectOid);
  const selectedTeacher = teachers.find(tc => tc.oid === form.teacherOid);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/timetable')}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Timetable Entry</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Schedule a new class session</p>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Form ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Day Picker */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => set('day', day)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        form.day === day
                          ? DAY_SELECTED[day]
                          : DAY_COLORS[day] + ' hover:opacity-80'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time + Period */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  Time & Period
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Start Time <span className="text-red-500">*</span></p>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={e => set('startTime', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">End Time <span className="text-red-500">*</span></p>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={e => set('endTime', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" /> Period <span className="text-red-500">*</span>
                    </p>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="e.g. 1"
                      value={form.period}
                      onChange={e => set('period', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Class + Subject */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  Class & Subject
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Class <span className="text-red-500">*</span></p>
                    <select
                      value={form.classOid}
                      onChange={e => set('classOid', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select class...</option>
                      {classes.map(cls => (
                        <option key={cls.oid ?? cls.id} value={cls.oid ?? cls.id}>
                          {cls.name ?? cls.className}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Subject <span className="text-red-500">*</span></p>
                    <select
                      value={form.subjectOid}
                      onChange={e => set('subjectOid', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select subject...</option>
                      {subjects.map(subj => (
                        <option key={subj.oid ?? subj.id} value={subj.oid ?? subj.id}>
                          {subj.name ?? subj.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Teacher */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User className="h-4 w-4 text-indigo-500" />
                  Teacher
                </label>
                <select
                  value={form.teacherOid}
                  onChange={e => set('teacherOid', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select teacher...</option>
                  {teachers.map(tc => (
                    <option key={tc.oid} value={tc.oid}>
                      {tc.fullName ?? tc.name ?? tc.userName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 204, Lab 3, Gymnasium"
                  value={form.room}
                  onChange={e => set('room', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300">Timetable entry created! Redirecting...</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => navigate('/admin/timetable')}
                  className="px-5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || saving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4" /> Save Entry</>
                  )}
                </button>
              </div>
            </div>

            {/* ── Preview Card ── */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4 sticky top-6">
                <h3 className="text-sm font-semibold text-foreground">Preview</h3>

                {/* Day badge */}
                {form.day && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${DAY_COLORS[form.day]}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {form.day}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Time */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium text-foreground">
                        {form.startTime && form.endTime
                          ? `${form.startTime} – ${form.endTime}`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Period</p>
                      <p className="text-sm font-medium text-foreground">
                        {form.period ? `Period ${form.period}` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Class */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Class</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedClass ? (selectedClass.name ?? selectedClass.className) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Subject</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedSubject ? (selectedSubject.name ?? selectedSubject.subjectName) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Teacher</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedTeacher
                          ? (selectedTeacher.fullName ?? selectedTeacher.name ?? selectedTeacher.userName)
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Room</p>
                      <p className="text-sm font-medium text-foreground">
                        {form.room || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Completion indicator */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Form completion</span>
                    <span>
                      {[form.classOid, form.subjectOid, form.teacherOid, form.day, form.startTime, form.endTime, form.period]
                        .filter(Boolean).length} / 7
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${([form.classOid, form.subjectOid, form.teacherOid, form.day, form.startTime, form.endTime, form.period]
                          .filter(Boolean).length / 7) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}