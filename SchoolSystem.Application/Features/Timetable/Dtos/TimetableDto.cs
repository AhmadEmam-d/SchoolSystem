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
}