import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Save, Plus, Edit, Trash2, Clock, Users, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EditTimetable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('teacher');
  const days = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday')];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Set active tab based on URL parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'teacher' || type === 'class') {
      setActiveTab(type);
    }
  }, [searchParams]);

  // Mock data for teachers
  const teachers = [
    { id: '1', name: `Mr. Mohamed Ali`, subject: t('math') },
    { id: '2', name: `Ms. Fatima Hassan`, subject: t('arabic') },
    { id: '3', name: `Mr. Ahmed Said`, subject: t('science') },
    { id: '4', name: `Ms. Sara Ibrahim`, subject: t('english') },
  ];

  // Mock data for classes
  const classes = [
    { id: '1', name: `${t('grade')} 10 - ${t('sectionA')}` },
    { id: '2', name: `${t('grade')} 10 - ${t('sectionB')}` },
    { id: '3', name: `${t('grade')} 11 - ${t('sectionA')}` },
  ];

  // Mock data for subjects
  const subjects = [
    t('math'),
    t('arabic'),
    t('english'),
    t('science'),
    t('history'),
    t('geography'),
    t('physics'),
    t('chemistry'),
  ];

  const [selectedTeacher, setSelectedTeacher] = useState('1');
  const [selectedClass, setSelectedClass] = useState('1');

  // Schedule state - editable
  const [schedule, setSchedule] = useState([
    { id: '1', day: t('sunday'), time: '09:00', subject: subjects[0], class: classes[0].name, teacher: teachers[0].name, room: '101' },
    { id: '2', day: t('sunday'), time: '11:00', subject: subjects[4], class: classes[0].name, teacher: teachers[1].name, room: '102' },
    { id: '3', day: t('monday'), time: '10:00', subject: subjects[3], class: classes[1].name, teacher: teachers[2].name, room: '103' },
    { id: '4', day: t('tuesday'), time: '09:00', subject: subjects[2], class: classes[0].name, teacher: teachers[3].name, room: '104' },
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    class: '',
    teacher: '',
    room: '',
  });

  const getScheduleItem = (day, time) => {
    return schedule.find(s => s.day === day && s.time === time);
  };

  const handleSave = () => {
    alert(t('sessionUpdatedSuccess'));
    navigate('/admin/timetable');
  };

  // Add new session
  const handleAddSession = (day, time) => {
    setModalMode('add');
    setFormData({
      day,
      time,
      subject: '',
      class: activeTab === 'class' ? classes.find(c => c.id === selectedClass)?.name || '' : '',
      teacher: activeTab === 'teacher' ? teachers.find(t => t.id === selectedTeacher)?.name || '' : '',
      room: '',
    });
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  // Edit existing session
  const handleEditSession = (item) => {
    setModalMode('edit');
    setFormData({
      day: item.day,
      time: item.time,
      subject: item.subject,
      class: item.class,
      teacher: item.teacher,
      room: item.room,
    });
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Delete session
  const handleDeleteSession = (item) => {
    if (confirm(t('confirmDeleteSession', { subject: item.subject }))) {
      setSchedule(schedule.filter(s => s.id !== item.id));
      alert(t('sessionDeletedSuccess'));
    }
  };

  // Save form (add or edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.class || !formData.teacher || !formData.room) {
      alert(t('fillAllFields'));
      return;
    }

    if (modalMode === 'add') {
      // Add new session
      const newItem = {
        id: Date.now().toString(),
        day: formData.day,
        time: formData.time,
        subject: formData.subject,
        class: formData.class,
        teacher: formData.teacher,
        room: formData.room,
      };
      setSchedule([...schedule, newItem]);
      alert(t('sessionAddedSuccess'));
    } else {
      // Edit existing session
      setSchedule(schedule.map(item => 
        item.id === currentItem?.id 
          ? { ...item, ...formData }
          : item
      ));
      alert(t('sessionUpdatedSuccess'));
    }

    setIsModalOpen(false);
    setFormData({ day: '', time: '', subject: '', class: '', teacher: '', room: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/timetable')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('editTimetable')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('editTimetableDesc')}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg"
        >
          <Save className="h-5 w-5" />
          {t('saveChanges')}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold transition-all ${
              activeTab === 'teacher'
                ? 'bg-purple-600 text-white border-b-4 border-purple-700'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <User className="h-5 w-5" />
            {t('editTeacherTimetable')}
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold transition-all ${
              activeTab === 'class'
                ? 'bg-purple-600 text-white border-b-4 border-purple-700'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="h-5 w-5" />
            {t('editClassTimetable')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Teacher Tab */}
          {activeTab === 'teacher' && (
            <div className="space-y-6">
              {/* Teacher Selection */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('selectTeacher')} *
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timetable Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-700">
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-400">{t('teacherTimetable')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <Clock className="h-5 w-5 inline mr-2" />
                        {t('time')}
                      </div>
                      {days.map((day) => (
                        <div key={day} className="p-4 font-semibold text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                          {day}
                        </div>
                      ))}
                    </div>

                    {times.map((time) => (
                      <div key={time} className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                          {time}
                        </div>
                        {days.map((day) => {
                          const item = getScheduleItem(day, time);
                          return (
                            <div key={`${day}-${time}`} className="p-2 border-l border-gray-200 dark:border-gray-700 min-h-[120px] bg-white dark:bg-gray-800">
                              {item ? (
                                <div className="h-full bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 border-2 border-purple-300 dark:border-purple-600 relative group">
                                  <div className="font-bold text-sm text-purple-900 dark:text-purple-300 mb-1">{item.subject}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.class}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-500">{t('roomNumber')} {item.room}</div>
                                  {/* Action Buttons */}
                                  <div className="absolute top-2 left-2 flex gap-1">
                                    <button
                                      className="p-1.5 bg-white hover:bg-blue-50 rounded shadow border border-blue-300 transition-colors"
                                      onClick={() => handleEditSession(item)}
                                      title={t('edit')}
                                    >
                                      <Edit className="h-3.5 w-3.5 text-blue-600" />
                                    </button>
                                    <button
                                      className="p-1.5 bg-white hover:bg-red-50 rounded shadow border border-red-300 transition-colors"
                                      onClick={() => handleDeleteSession(item)}
                                      title={t('delete')}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddSession(day, time)}
                                  className="h-full w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-lg flex items-center justify-center transition-all group"
                                >
                                  <Plus className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Class Tab */}
          {activeTab === 'class' && (
            <div className="space-y-6">
              {/* Class Selection */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('selectClass')} *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timetable Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">{t('classTimetable')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <Clock className="h-5 w-5 inline mr-2" />
                        {t('time')}
                      </div>
                      {days.map((day) => (
                        <div key={day} className="p-4 font-semibold text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                          {day}
                        </div>
                      ))}
                    </div>

                    {times.map((time) => (
                      <div key={time} className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                          {time}
                        </div>
                        {days.map((day) => {
                          const item = getScheduleItem(day, time);
                          return (
                            <div key={`${day}-${time}`} className="p-2 border-l border-gray-200 dark:border-gray-700 min-h-[120px] bg-white dark:bg-gray-800">
                              {item ? (
                                <div className="h-full bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border-2 border-blue-300 dark:border-blue-600 relative group">
                                  <div className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-1">{item.subject}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.teacher}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-500">{t('roomNumber')} {item.room}</div>
                                  {/* Action Buttons */}
                                  <div className="absolute top-2 left-2 flex gap-1">
                                    <button
                                      className="p-1.5 bg-white hover:bg-blue-50 rounded shadow border border-blue-300 transition-colors"
                                      onClick={() => handleEditSession(item)}
                                      title={t('edit')}
                                    >
                                      <Edit className="h-3.5 w-3.5 text-blue-600" />
                                    </button>
                                    <button
                                      className="p-1.5 bg-white hover:bg-red-50 rounded shadow border border-red-300 transition-colors"
                                      onClick={() => handleDeleteSession(item)}
                                      title={t('delete')}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddSession(day, time)}
                                  className="h-full w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg flex items-center justify-center transition-all group"
                                >
                                  <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 {t('editingInstructions')}</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
            <span>{t('editingInstructions1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
            <span>{t('editingInstructions2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
            <span>{t('editingInstructions3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold">���</span>
            <span>{t('editingInstructions4')}</span>
          </li>
        </ul>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
              <h2 className="text-2xl font-bold text-white">
                {modalMode === 'add' ? `➕ ${t('addSession')}` : `✏️ ${t('editSession')}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
              {/* Day & Time (Read-only if editing, or show info if adding) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">📅 {t('day')}</label>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{formData.day}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">🕐 {t('time')}</label>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{formData.time}</p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📚 {t('subject')} *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{t('selectSubject')}</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👨‍🏫 {t('teacher')} *
                </label>
                <select
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={activeTab === 'teacher'}
                >
                  <option value="">{t('selectTeacher')}</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
                {activeTab === 'teacher' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('teacherAutoSelected')}</p>
                )}
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🏫 {t('class')} *
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={activeTab === 'class'}
                >
                  <option value="">{t('selectClass')}</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
                {activeTab === 'class' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('classAutoSelected')}</p>
                )}
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🚪 {t('roomNumber')} *
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('roomNumberPlaceholder')}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  {modalMode === 'add' ? `➕ ${t('addSession')}` : `💾 ${t('saveChanges')}`}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
