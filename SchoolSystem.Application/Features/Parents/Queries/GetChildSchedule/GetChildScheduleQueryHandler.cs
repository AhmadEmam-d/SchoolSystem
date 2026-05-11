// Application/Features/Parents/Queries/GetChildSchedule/GetChildScheduleQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.Timetable.Queries.GetStudentWeeklySchedule;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetChildSchedule
{
    public class GetChildScheduleQueryHandler : IRequestHandler<GetChildScheduleQuery, ChildScheduleDto>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMediator _mediator;

        public GetChildScheduleQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _mediator = mediator;
        }

        public async Task<ChildScheduleDto> Handle(GetChildScheduleQuery request, CancellationToken cancellationToken)
        {

            if (!Guid.TryParse(request.ParentUserId, out var parentUserIdGuid))
            {
                throw new UnauthorizedAccessException("Invalid Parent User ID format");
            }

            var parent = await _parentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(p => p.UserId == parentUserIdGuid, cancellationToken);

            if (parent == null)
                throw new UnauthorizedAccessException("Parent not found");

            var student = await _studentRepo.GetAllQueryable()
                .Include(s => s.Class)
                .FirstOrDefaultAsync(s => s.Oid == request.ChildId && s.ParentOid == parent.Oid, cancellationToken);

            if (student == null)
                throw new UnauthorizedAccessException("You don't have access to this student");

            // Fix: Use constructor parameters instead of property initializers
            var scheduleQuery = new GetStudentWeeklyScheduleQuery(
                student.Oid,  // studentId (Guid)
                GetStartOfWeek(DateTime.UtcNow)  // weekStartDate (DateTime?)
            );

            var weeklyScheduleData = await _mediator.Send(scheduleQuery, cancellationToken);

            // Check if we got schedule data
            if (weeklyScheduleData?.WeeklyTimetable == null)
            {
                return new ChildScheduleDto
                {
                    ChildId = student.Oid,
                    ChildName = student.FullName,
                    WeeklySchedule = new List<ScheduleDayDto>(),
                    TodayClasses = new List<UpcomingClassDto>(),
                    TomorrowClasses = new List<UpcomingClassDto>()
                };
            }

            // Transform to parent-friendly DTO
            var weeklySchedule = new List<ScheduleDayDto>();
            var today = DateTime.Now;
            var tomorrow = today.AddDays(1);

            var todayClasses = new List<UpcomingClassDto>();
            var tomorrowClasses = new List<UpcomingClassDto>();

            foreach (var daySchedule in weeklyScheduleData.WeeklyTimetable)
            {
                // Parse day name to get DayOfWeek
                var dayOfWeek = ParseDayName(daySchedule.DayName);

                var scheduleDay = new ScheduleDayDto
                {
                    DayName = daySchedule.DayName,
                    DayNameAr = GetArabicDayName(daySchedule.DayName),
                    Classes = daySchedule.Lessons.Select(l => new ClassScheduleDto
                    {
                        SubjectName = l.SubjectName,
                        SubjectNameAr = GetArabicSubjectName(l.SubjectName),
                        StartTime = ParseTime(l.Time),
                        EndTime = ParseTime(l.Time).Add(TimeSpan.FromMinutes(45)), // Assuming 45-min classes
                        RoomNumber = l.Room,
                        TeacherName = l.TeacherName,
                        Period = GetPeriodNumber(ParseTime(l.Time))
                    }).ToList()
                };
                weeklySchedule.Add(scheduleDay);

                // Check if this is today's schedule
                if (dayOfWeek == today.DayOfWeek)
                {
                    todayClasses = scheduleDay.Classes.Select(c => new UpcomingClassDto
                    {
                        SubjectName = c.SubjectName,
                        SubjectNameAr = c.SubjectNameAr,
                        StartTime = c.StartTime,
                        EndTime = c.EndTime,
                        RoomNumber = c.RoomNumber,
                        TeacherName = c.TeacherName,
                        ClassDate = today,
                        Status = GetClassStatus(c.StartTime, c.EndTime)
                    }).ToList();
                }

                // Check if this is tomorrow's schedule
                if (dayOfWeek == tomorrow.DayOfWeek)
                {
                    tomorrowClasses = scheduleDay.Classes.Select(c => new UpcomingClassDto
                    {
                        SubjectName = c.SubjectName,
                        SubjectNameAr = c.SubjectNameAr,
                        StartTime = c.StartTime,
                        EndTime = c.EndTime,
                        RoomNumber = c.RoomNumber,
                        TeacherName = c.TeacherName,
                        ClassDate = tomorrow,
                        Status = "Upcoming"
                    }).ToList();
                }
            }

            return new ChildScheduleDto
            {
                ChildId = student.Oid,
                ChildName = student.FullName,
                WeeklySchedule = weeklySchedule,
                TodayClasses = todayClasses,
                TomorrowClasses = tomorrowClasses
            };
        }

        private DateTime GetStartOfWeek(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
        }

        private DayOfWeek ParseDayName(string dayName)
        {
            return dayName switch
            {
                "Monday" => DayOfWeek.Monday,
                "Tuesday" => DayOfWeek.Tuesday,
                "Wednesday" => DayOfWeek.Wednesday,
                "Thursday" => DayOfWeek.Thursday,
                "Friday" => DayOfWeek.Friday,
                "Saturday" => DayOfWeek.Saturday,
                "Sunday" => DayOfWeek.Sunday,
                _ => DayOfWeek.Monday
            };
        }

        private string GetArabicDayName(string dayName)
        {
            return dayName switch
            {
                "Monday" => "الإثنين",
                "Tuesday" => "الثلاثاء",
                "Wednesday" => "الأربعاء",
                "Thursday" => "الخميس",
                "Friday" => "الجمعة",
                "Saturday" => "السبت",
                "Sunday" => "الأحد",
                _ => dayName
            };
        }

        private string GetArabicSubjectName(string subjectName)
        {
            // You can expand this mapping or get from database
            var mapping = new Dictionary<string, string>
            {
                { "Mathematics", "الرياضيات" },
                { "Math", "الرياضيات" },
                { "Science", "العلوم" },
                { "Arabic", "اللغة العربية" },
                { "English", "اللغة الإنجليزية" },
                { "History", "التاريخ" },
                { "Geography", "الجغرافيا" },
                { "Physics", "الفيزياء" },
                { "Chemistry", "الكيمياء" },
                { "Biology", "الأحياء" },
                { "Islamic Studies", "التربية الإسلامية" },
                { "Islamic", "التربية الإسلامية" }
            };

            return mapping.ContainsKey(subjectName) ? mapping[subjectName] : subjectName;
        }

        private TimeSpan ParseTime(string timeString)
        {
            if (string.IsNullOrEmpty(timeString))
                return TimeSpan.Zero;

            // Parse time like "2:30 PM" to TimeSpan
            if (DateTime.TryParse(timeString, out DateTime dateTime))
                return dateTime.TimeOfDay;

            // Try to parse as TimeSpan directly
            if (TimeSpan.TryParse(timeString, out TimeSpan time))
                return time;

            return TimeSpan.Zero;
        }

        private string GetPeriodNumber(TimeSpan startTime)
        {
            var hour = startTime.Hours;
            if (hour >= 8 && hour < 9) return "1st Period";
            if (hour >= 9 && hour < 10) return "2nd Period";
            if (hour >= 10 && hour < 11) return "3rd Period";
            if (hour >= 11 && hour < 12) return "4th Period";
            if (hour >= 12 && hour < 13) return "5th Period";
            if (hour >= 13 && hour < 14) return "6th Period";
            if (hour >= 14 && hour < 15) return "7th Period";
            return "Special Period";
        }

        private string GetClassStatus(TimeSpan startTime, TimeSpan endTime)
        {
            var now = DateTime.Now.TimeOfDay;

            if (now < startTime)
                return "Upcoming";
            else if (now >= startTime && now <= endTime)
                return "In Progress";
            else
                return "Completed";
        }
    }
}