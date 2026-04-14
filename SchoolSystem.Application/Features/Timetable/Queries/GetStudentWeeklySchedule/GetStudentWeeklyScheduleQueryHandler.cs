using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetStudentWeeklySchedule
{
    public class GetStudentWeeklyScheduleQueryHandler : IRequestHandler<GetStudentWeeklyScheduleQuery, StudentWeeklyScheduleDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Domain.Entities.Timetable> _timetableRepo;
        private readonly IMapper _mapper;

        public GetStudentWeeklyScheduleQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Domain.Entities.Timetable> timetableRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _timetableRepo = timetableRepo;
            _mapper = mapper;
        }

        public async Task<StudentWeeklyScheduleDto> Handle(GetStudentWeeklyScheduleQuery request, CancellationToken cancellationToken)
        {
            // Get student - try by Oid first, then by UserId
            var student = await _studentRepo.GetByOidAsync(request.StudentId);

            if (student == null)
            {
                // If not found by Oid, try to find by UserId
                student = await _studentRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.UserId == request.StudentId, cancellationToken);
            }

            if (student == null)
                throw new Exception("Student not found");

            // Get week start date (Monday)
            var weekStart = request.WeekStartDate ?? GetStartOfWeek(DateTime.UtcNow);

            // Get timetables for student's class
            var timetables = await _timetableRepo
                .GetAllQueryable()
                .Include(t => t.Subject)   // أضف هذا
                .Include(t => t.Teacher)
                .Where(t => t.ClassOid == student.ClassOid && !t.IsDeleted)
                .ToListAsync(cancellationToken);

            // Days mapping from DayOfWeek to display names
            var dayNames = new Dictionary<DayOfWeek, string>
            {
                { DayOfWeek.Monday, "Monday" }, { DayOfWeek.Tuesday, "Tuesday" },
                { DayOfWeek.Wednesday, "Wednesday" }, { DayOfWeek.Thursday, "Thursday" },
                { DayOfWeek.Friday, "Friday" }, { DayOfWeek.Saturday, "Saturday" },
                { DayOfWeek.Sunday, "Sunday" }
            };

            var shortDayNames = new Dictionary<DayOfWeek, string>
            {
                { DayOfWeek.Monday, "Mon" }, { DayOfWeek.Tuesday, "Tue" },
                { DayOfWeek.Wednesday, "Wed" }, { DayOfWeek.Thursday, "Thu" },
                { DayOfWeek.Friday, "Fri" }, { DayOfWeek.Saturday, "Sat" },
                { DayOfWeek.Sunday, "Sun" }
            };

            // Define week days (Monday to Friday)
            var weekDays = new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday };

            // Create calendar and weekly schedule
            var calendar = new List<CalendarDayDto>();
            var weeklyTimetable = new List<WeeklyDayScheduleDto>();

            int dayIndex = 0;
            foreach (var dayOfWeek in weekDays)
            {
                var dayTimetables = timetables
                    .Where(t => t.Day == dayOfWeek)
                    .OrderBy(t => t.StartTime)
                    .ToList();

                var currentDate = weekStart.AddDays(dayIndex);
                var dayNumber = currentDate.Day;
                var monthName = currentDate.ToString("MMM");

                // Add to calendar
                calendar.Add(new CalendarDayDto
                {
                    DayName = shortDayNames[dayOfWeek],
                    DayNumber = dayNumber,
                    ClassesCount = dayTimetables.Count
                });

                // Create lessons for this day
                var lessons = new List<StudentLessonDto>();
                foreach (var timetable in dayTimetables)
                {
                    lessons.Add(new StudentLessonDto
                    {
                        Time = FormatTime(timetable.StartTime),
                        SubjectName = timetable.Subject?.Name ?? "N/A",
                        TeacherName = timetable.Teacher?.FullName ?? "N/A",
                        Room = timetable.Room ?? "N/A"
                    });
                }

                // Add to weekly timetable
                weeklyTimetable.Add(new WeeklyDayScheduleDto
                {
                    DayName = dayNames[dayOfWeek],
                    Date = $"{monthName} {dayNumber}",
                    Lessons = lessons
                });

                dayIndex++;
            }

            return new StudentWeeklyScheduleDto
            {
                Title = "myScheduleTitle",
                ViewText = "viewWeeklyTimetable",
                Description = "completeScheduleDesc",
                Calendar = calendar,
                WeeklyTimetable = weeklyTimetable
            };
        }

        private DateTime GetStartOfWeek(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
        }

        private string FormatTime(TimeSpan time)
        {
            var hour = time.Hours % 12;
            if (hour == 0) hour = 12;
            var minute = time.Minutes.ToString("00");
            var period = time.Hours >= 12 ? "PM" : "AM";
            return $"{hour}:{minute} {period}";
        }
    }
}