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
            var student = await _studentRepo.GetByOidAsync(request.StudentId);

            if (student == null)
            {
                student = await _studentRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.UserId == request.StudentId, cancellationToken);
            }

            if (student == null)
                throw new Exception("Student not found");

            var weekStart = request.WeekStartDate ?? GetStartOfWeek(DateTime.UtcNow);

            var timetables = await _timetableRepo
                .GetAllQueryable()
                .Include(t => t.Subject)  
                .Include(t => t.Teacher)
                .Where(t => t.ClassOid == student.ClassOid && !t.IsDeleted)
                .ToListAsync(cancellationToken);

            var dayNames = new Dictionary<DayOfWeek, string>
            {
                { DayOfWeek.Sunday,    "Sunday"    },
                { DayOfWeek.Monday,    "Monday"    },
                { DayOfWeek.Tuesday,   "Tuesday"   },
                { DayOfWeek.Wednesday, "Wednesday" },
                { DayOfWeek.Thursday,  "Thursday"  }
            };

            var shortDayNames = new Dictionary<DayOfWeek, string>
            {
                { DayOfWeek.Sunday,    "Sun" },
                { DayOfWeek.Monday,    "Mon" },
                { DayOfWeek.Tuesday,   "Tue" },
                { DayOfWeek.Wednesday, "Wed" },
                { DayOfWeek.Thursday,  "Thu" }
            };

            var weekDays = new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday };

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

                calendar.Add(new CalendarDayDto
                {
                    DayName = shortDayNames[dayOfWeek],
                    DayNumber = dayNumber,
                    ClassesCount = dayTimetables.Count
                });

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
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Sunday)) % 7;
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