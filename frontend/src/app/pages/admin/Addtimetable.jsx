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

const toMin = t => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const timesOverlap = (start1, end1, start2, end2) => {
  const s1 = toMin(start1), e1 = toMin(end1);
  const s2 = toMin(start2), e2 = toMin(end2);
  return s1 < e2 && s2 < e1;
};

const getConflicts = (form, timetable) => {
  const errors = [];
  const { classOid, teacherOid, day, startTime, endTime, period } = form;

  if (!day || !startTime || !endTime || !period) return errors;

  // endTime لازم بعد startTime
  if (toMin(endTime) <= toMin(startTime)) {
    errors.push('وقت الانتهاء لازم يكون بعد وقت البداية');
    return errors;
  }

  const sameDay = timetable.filter(e => e.day === day);

  for (const entry of sameDay) {
    const overlap = timesOverlap(startTime, endTime, entry.startTime, entry.endTime);

    // 1. نفس الكلاس + تعارض في الوقت
    if (classOid && entry.classOid === classOid && overlap) {
      errors.push(
        `الفصل "${entry.className}" عنده حصة "${entry.subjectName}" من ${entry.startTime} لـ ${entry.endTime} في نفس الوقت`
      );
    }

    // 2. نفس الكلاس + نفس الـ period
    if (classOid && entry.classOid === classOid && String(entry.period) === String(period)) {
      errors.push(
        `الفصل "${entry.className}" عنده حصة "${entry.subjectName}" في نفس الحصة (Period ${period})`
      );
    }

    // 3. نفس المدرس + تعارض في الوقت
    if (teacherOid && entry.teacherOid === teacherOid && overlap) {
      errors.push(
        `المدرس "${entry.teacherName ?? 'المختار'}" عنده حصة "${entry.subjectName}" من ${entry.startTime} لـ ${entry.endTime} في نفس الوقت`
      );
    }
  }

  return [...new Set(errors)];
};

export function AddTimetable() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [classes,   setClasses]   = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [teachers,  setTeachers]  = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

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

  useEffect(() => {
    const load = async () => {
      try {
        const [cls, subj, teach, tt] = await Promise.all([
          api.classes.getAll(),
          api.subjects.getAll(),
          api.teachers.getAll(),
          api.timetable.getAll(),
        ]);
        setClasses(Array.isArray(cls)   ? cls   : cls?.data  ?? []);
        setSubjects(Array.isArray(subj)  ? subj  : subj?.data ?? []);
        setTeachers(Array.isArray(teach) ? teach : teach?.data ?? []);
        setTimetable(Array.isArray(tt)   ? tt    : tt?.data   ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // ─── Filtered lists ───────────────────────────────────────────────────────
  const filteredSubjects = form.teacherOid
    ? (teachers.find(t => t.oid === form.teacherOid)?.subjects ?? [])
    : subjects;

  const filteredTeachers = form.subjectOid
    ? teachers.filter(t => t.subjects?.some(s => s.oid === form.subjectOid))
    : teachers;

  // ─── Smart change handlers ────────────────────────────────────────────────
  const handleTeacherChange = (teacherOid) => {
    const teacherSubjects = teachers.find(t => t.oid === teacherOid)?.subjects ?? [];
    const subjectStillValid = teacherSubjects.some(s => s.oid === form.subjectOid);
    setForm(prev => ({
      ...prev,
      teacherOid,
      subjectOid: subjectStillValid ? prev.subjectOid : '',
    }));
  };

  const handleSubjectChange = (subjectOid) => {
    const teacherHasSubject = teachers
      .find(t => t.oid === form.teacherOid)
      ?.subjects?.some(s => s.oid === subjectOid);
    setForm(prev => ({
      ...prev,
      subjectOid,
      teacherOid: teacherHasSubject ? prev.teacherOid : '',
    }));
  };

  // ─── Conflict check (real-time) ───────────────────────────────────────────
  const conflicts = getConflicts(form, timetable);

  // ─── endTime valid ────────────────────────────────────────────────────────
  const endTimeValid = !form.startTime || !form.endTime || toMin(form.endTime) > toMin(form.startTime);

  // ─── Preview helpers ──────────────────────────────────────────────────────
  const selectedClass   = classes.find(c  => (c.oid ?? c.id) === form.classOid);
  const selectedSubject = filteredSubjects.find(s => s.oid === form.subjectOid);
  const selectedTeacher = filteredTeachers.find(tc => tc.oid === form.teacherOid);

  const canSubmit =
    form.classOid && form.subjectOid && form.teacherOid &&
    form.day && form.startTime && form.endTime && form.period &&
    endTimeValid &&
    conflicts.length === 0;

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
        const backendError =
          res?.errors?.[0] ||
          res?.messages?.EN ||
          res?.message ||
          'Failed to create timetable entry';
        throw new Error(backendError);
      }

      // Assign teacher to class
      console.log('🔵 Calling assignTeacher with:', { classId: form.classOid, teacherId: form.teacherOid });
      try {
        const assignRes = await api.classes.assignTeacher({
          classId:   form.classOid,
          teacherId: form.teacherOid,
        });
        console.log('🟢 assignTeacher response:', assignRes);
      } catch (assignErr) {
        console.error('🔴 assign-teacher failed:', assignErr);
        // مش بنوقف العملية لو الـ timetable اتعمل بنجاح بالفعل
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/timetable'), 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

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
                      className={`w-full px-3 py-2.5 rounded-lg border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                        !endTimeValid ? 'border-red-400 focus:ring-red-400' : 'border-border'
                      }`}
                    />
                    {!endTimeValid && (
                      <p className="text-xs text-red-500">لازم يكون بعد وقت البداية</p>
                    )}
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
                      onChange={e => handleSubjectChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">
                        {form.teacherOid ? 'Subjects by selected teacher...' : 'Select subject...'}
                      </option>
                      {filteredSubjects.map(subj => (
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
                  onChange={e => handleTeacherChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">
                    {form.subjectOid ? 'Teachers for selected subject...' : 'Select teacher...'}
                  </option>
                  {filteredTeachers.map(tc => (
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

              {/* ── Conflict Warnings ── */}
              {conflicts.length > 0 && (
                <div className="space-y-2">
                  {conflicts.map((msg, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">{msg}</p>
                    </div>
                  ))}
                </div>
              )}

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

                {form.day && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${DAY_COLORS[form.day]}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {form.day}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className={`text-sm font-medium ${!endTimeValid ? 'text-red-500' : 'text-foreground'}`}>
                        {form.startTime && form.endTime ? `${form.startTime} – ${form.endTime}` : '—'}
                        {!endTimeValid && ' ⚠️'}
                      </p>
                    </div>
                  </div>

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

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Room</p>
                      <p className="text-sm font-medium text-foreground">{form.room || '—'}</p>
                    </div>
                  </div>
                </div>

                {conflicts.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected
                    </p>
                  </div>
                )}

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