using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Timetable.DTOs
{
    public class TimetableDto
    {
        public Guid Oid { get; set; }
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; }
        public Guid SubjectOid { get; set; }
        public string SubjectName { get; set; }
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Room { get; set; }
        public int Period { get; set; }
    }

    public class CreateTimetableDto
    {
        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }
        public Guid TeacherOid { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Room { get; set; }
        public int Period { get; set; }
    }

    public class UpdateTimetableDto
    {
        public Guid Oid { get; set; }
        public Guid? ClassOid { get; set; }
        public Guid? SubjectOid { get; set; }
        public Guid? TeacherOid { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Room { get; set; }
        public int? Period { get; set; }
    }

    public class TimetableByTeacherDto
    {
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; }
        public Dictionary<string, List<TimetableSlotDto>> WeeklySchedule { get; set; }
    }

    public class TimetableByClassDto
    {
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; }
        public Dictionary<string, List<TimetableSlotDto>> WeeklySchedule { get; set; }
    }

    public class TimetableSlotDto
    {
        public string Time { get; set; }
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public string Room { get; set; }
        public string ClassName { get; set; }

        public Guid ClassOid { get; set; }      // معرف الصف
        public Guid SubjectOid { get; set; }    // معرف المادة
        public string Day { get; set; }         // اليوم
        public string StartTime { get; set; }   // وقت البدء
        public string EndTime { get; set; }     // وقت الانتهاء
        public int Period { get; set; }
    }
    public class StudentWeeklyScheduleDto
    {
        public string Title { get; set; } = "myScheduleTitle";
        public string ViewText { get; set; } = "viewWeeklyTimetable";
        public string Description { get; set; } = "completeScheduleDesc";
        public List<CalendarDayDto> Calendar { get; set; }
        public List<WeeklyDayScheduleDto> WeeklyTimetable { get; set; }
    }
    public class CalendarDayDto
    {
        public string DayName { get; set; } // Mon, Tue, Wed, Thu, Fri
        public int DayNumber { get; set; } // 13, 14, 15, 16, 17
        public int ClassesCount { get; set; }
    }

    public class WeeklyDayScheduleDto
    {
        public string DayName { get; set; } // Monday, Tuesday, etc.
        public string Date { get; set; } // Apr 13
        public List<StudentLessonDto> Lessons { get; set; }
    }
    public class StudentLessonDto
    {
        public string Time { get; set; } // "12:00 PM"
        public string SubjectName { get; set; } // "English"
        public string TeacherName { get; set; } // "Shakespeare"
        public string Room { get; set; } // "Room 205"
        public string? ExtraInfo { get; set; } // Optional extra info
    }

}