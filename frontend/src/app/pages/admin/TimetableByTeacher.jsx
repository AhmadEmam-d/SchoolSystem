import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Printer, User, Clock, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function TimetableByTeacher() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  // ✅ Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const teachersList = await api.teachers.getAll();
        
       // console.log("📚 Teachers loaded:", teachersList);
        
        if (teachersList && teachersList.length > 0) {
          setTeachers(teachersList);
          setSelectedTeacher(teachersList[0].oid);
          setCurrentTeacher(teachersList[0]);
        } else {
          toast.error("No teachers found");
        }
      } catch (error) {
        console.error("Error loading teachers:", error);
        toast.error("Error loading teachers");
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  // ✅ Fetch Timetable when teacher changes
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedTeacher) {
        console.log("No teacher selected");
        return;
      }

   //   console.log("🟢 Fetching timetable for teacher:", selectedTeacher);
      setLoading(true);

      try {
        const response = await api.timetable.getByTeacher(selectedTeacher);
        
      //  console.log("🟢 Full response:", response);
        
        if (!response.ok) {
          console.error("Response not OK:", response);
          toast.error(response.data?.message || "Failed to load timetable");
          setTimetableData({});
          return;
        }

        let timetableResponse = response.data;
     //   console.log("🟢 Timetable data:", timetableResponse);

        // Find teacher info
        const teacher = teachers.find(t => t.oid === selectedTeacher);
        setCurrentTeacher(teacher);

        // Check different response structures
        let weeklySchedule = null;
        
        if (timetableResponse && timetableResponse.weeklySchedule) {
          weeklySchedule = timetableResponse.weeklySchedule;
        } else if (timetableResponse && timetableResponse.data && timetableResponse.data.weeklySchedule) {
          weeklySchedule = timetableResponse.data.weeklySchedule;
        } else if (timetableResponse && Array.isArray(timetableResponse)) {
          // Convert array format to organized structure
          const organized = {};
          days.forEach(day => { organized[day] = {}; });
          
          timetableResponse.forEach(slot => {
            if (slot.day && slot.startTime) {
              organized[slot.day][slot.startTime] = {
                subjectName: slot.subjectName || slot.subject?.name || '-',
                className: slot.className || slot.class?.name || '-',
                room: slot.room || '-'
              };
            }
          });
          
          setTimetableData(organized);
          return;
        }

        if (weeklySchedule) {
          const organized = {};
          
          days.forEach(day => {
            organized[day] = {};
          });

          Object.entries(weeklySchedule).forEach(([day, slots]) => {
            if (slots && Array.isArray(slots) && slots.length > 0) {
              slots.forEach(slot => {
                const startTime = slot.startTime;
                
                organized[day][startTime] = {
                  subjectName: slot.subjectName || slot.subject?.name || '-',
                  className: slot.className || slot.class?.name || '-',
                  room: slot.room || '-'
                };
              });
            }
          });

        //  console.log("✅ Organized timetable:", organized);
          setTimetableData(organized);
        } else {
          console.log("⚠️ No weeklySchedule found in response");
          setTimetableData({});
        }

      } catch (error) {
        console.error("❌ Error fetching timetable:", error);
        toast.error("Failed to load timetable");
        setTimetableData({});
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedTeacher, teachers]);

  const getScheduleItem = (day, time) => {
    return timetableData[day]?.[time] || null;
  };

  const totalHours = Object.values(timetableData)
    .flatMap(day => Object.values(day)).length;

  const handlePrint = () => {
    window.print();
  };

  if (loadingTeachers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/timetable')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Timetable</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage teacher schedules</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          <button 
            onClick={() => navigate('/admin/timetable/edit')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Select Teacher */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Teacher
        </label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {teachers.map(t => (
            <option key={t.oid} value={t.oid}>
              {t.fullName || t.name || t.email || 'Unnamed Teacher'}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Info */}
      {currentTeacher && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{currentTeacher.fullName || currentTeacher.name}</h2>
              <p className="text-purple-100 mt-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Total: {totalHours} classes per week
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg">
          <div className="text-gray-500">Loading timetable...</div>
        </div>
      )}

      {/* Timetable Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-200 p-3 text-left font-semibold text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {times.map(time => (
                  <tr key={time} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-200 p-3 font-medium text-gray-700">
                      {time}
                    </td>

                    {days.map(day => {
                      const item = getScheduleItem(day, time);

                      return (
                        <td key={day} className="border border-gray-200 p-3">
                          {item ? (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-800">{item.className}</div>
                              <div className="text-sm text-gray-600">{item.subjectName}</div>
                              <div className="text-xs text-gray-500">Room: {item.room}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !loadingTeachers && Object.keys(timetableData).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No timetable found</h3>
          <p className="text-gray-500 mt-1">No schedule available for this teacher</p>
          <button
            onClick={() => navigate('/admin/timetable/edit')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Timetable
          </button>
        </div>
      )}
    </div>
  );
}