using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Timetable.DTOs
{
    public class TimetableDto
    {
        public Guid Oid { get; set; }
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public Guid SubjectOid { get; set; }
        public string SubjectName { get; set; }= string.Empty;
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public string Day { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public int Period { get; set; } = new int();
    }

    public class CreateTimetableDto
    {
        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }
        public Guid TeacherOid { get; set; }
        public string Day { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public int Period { get; set; } = new int();
    }

    public class UpdateTimetableDto
    {
        public Guid Oid { get; set; }
        public Guid? ClassOid { get; set; }
        public Guid? SubjectOid { get; set; }
        public Guid? TeacherOid { get; set; }
        public string Day { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public int? Period { get; set; }
    }

    public class TimetableByTeacherDto
    {
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public Dictionary<string, List<TimetableSlotDto>> WeeklySchedule { get; set; }= new Dictionary<string, List<TimetableSlotDto>>();
    }

    public class TimetableByClassDto
    {
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public Dictionary<string, List<TimetableSlotDto>> WeeklySchedule { get; set; } = new Dictionary<string, List<TimetableSlotDto>>();
    }

    public class TimetableSlotDto
    {
        public string Time { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;

        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }  
        public string Day { get; set; } = string.Empty;       
        public string StartTime { get; set; } = string.Empty;   
        public string EndTime { get; set; } = string.Empty;   
        public int Period { get; set; }
    }
    public class StudentWeeklyScheduleDto
    {
        public string Title { get; set; } = "myScheduleTitle";
        public string ViewText { get; set; } = "viewWeeklyTimetable";
        public string Description { get; set; } = "completeScheduleDesc";
        public List<CalendarDayDto> Calendar { get; set; } = new List<CalendarDayDto>();
        public List<WeeklyDayScheduleDto> WeeklyTimetable { get; set; } = new List<WeeklyDayScheduleDto>();
    }
    public class CalendarDayDto
    {
        public string DayName { get; set; } = string.Empty; 
        public int DayNumber { get; set; }
        public int ClassesCount { get; set; }
    }

    public class WeeklyDayScheduleDto
    {
        public string DayName { get; set; } = string.Empty; 
        public string Date { get; set; } = string.Empty; 
        public List<StudentLessonDto> Lessons { get; set; } = new List<StudentLessonDto>();
    }
    public class StudentLessonDto
    {
        public string Time { get; set; } = string.Empty; 
        public string SubjectName { get; set; } = string.Empty; 
        public string TeacherName { get; set; } = string.Empty; 
        public string Room { get; set; } = string.Empty; 
        public string? ExtraInfo { get; set; } 
    }

}