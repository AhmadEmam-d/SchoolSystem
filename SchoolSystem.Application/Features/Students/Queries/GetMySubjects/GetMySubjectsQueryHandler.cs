using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Students.DTOs;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Queries.GetMySubjects
{
    public class GetMySubjectsQueryHandler : IRequestHandler<GetMySubjectsQuery, MySubjectsDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Domain.Entities.Timetable> _timetableRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IMapper _mapper;

        public GetMySubjectsQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Domain.Entities.Timetable> timetableRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _timetableRepo = timetableRepo;
            _homeworkRepo = homeworkRepo;
            _submissionRepo = submissionRepo;
            _mapper = mapper;
        }

        public async Task<MySubjectsDto> Handle(GetMySubjectsQuery request, CancellationToken cancellationToken)
        {
            // Find student by StudentId (Oid)
            var student = await _studentRepo.GetByOidAsync(request.StudentId);

            if (student == null)
                throw new Exception("Student not found");

            // Get all subjects for student's class from timetable
            var subjects = await _timetableRepo
                .GetAllQueryable()
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.ClassOid == student.ClassOid && !t.IsDeleted)
                .Select(t => t.Subject)
                .Distinct()
                .ToListAsync(cancellationToken);

            var subjectDetails = new List<SubjectDetailsDto>();

            foreach (var subject in subjects)
            {
                // Get all timetables for this subject
                var subjectTimetables = await _timetableRepo
                    .GetAllQueryable()
                    .Include(t => t.Teacher)
                    .Where(t => t.ClassOid == student.ClassOid && t.SubjectOid == subject.Oid && !t.IsDeleted)
                    .ToListAsync(cancellationToken);

                // Calculate total and completed classes
                var totalClasses = subjectTimetables.Count;
                var now = DateTime.UtcNow;
                var completedClasses = subjectTimetables.Count(t =>
                    GetClassDateTime(t.Day, t.StartTime) < now);

                // Get homework assignments
                var homeworks = await _homeworkRepo
                    .GetAllQueryable()
                    .Where(h => h.SubjectOid == subject.Oid && h.ClassOid == student.ClassOid)
                    .ToListAsync(cancellationToken);

                var totalAssignments = homeworks.Count;
                var submittedAssignments = await _submissionRepo
                    .GetAllQueryable()
                    .Where(s => s.StudentOid == student.Oid && homeworks.Select(h => h.Oid).Contains(s.HomeworkOid))
                    .CountAsync(cancellationToken);

                // Get next class
                var nextClass = GetNextClass(subjectTimetables);

                // Get pending assignments
                var pendingCount = homeworks.Count(h => h.DueDate > now);

                // Get subject grade (placeholder)
                var grade = await GetSubjectGrade(student.Oid, subject.Oid);

                subjectDetails.Add(new SubjectDetailsDto
                {
                    SubjectName = subject.Name,
                    TeacherName = subjectTimetables.FirstOrDefault()?.Teacher?.FullName ?? "N/A",
                    CourseProgress = new CourseProgressDto
                    {
                        CompletedClasses = completedClasses,
                        TotalClasses = totalClasses,
                        Attendance = 92,
                        CompletedAssignments = submittedAssignments,
                        TotalAssignments = totalAssignments
                    },
                    NextClass = nextClass,
                    PendingAssignments = new PendingAssignmentsDto
                    {
                        Count = pendingCount
                    },
                    Grade = grade
                });
            }

            // Calculate overall grade
            var overallGrade = subjectDetails.Any(s => s.Grade.HasValue)
                ? subjectDetails.Where(s => s.Grade.HasValue).Average(s => s.Grade.Value)
                : 0;

            return new MySubjectsDto
            {
                Title = "My Subjects",
                Subtitle = "trackPerformanceSubjects",
                TotalSubjectsCard = new TotalSubjectsCardDto
                {
                    TotalSubjects = subjects.Count,
                    OverallGrade = Math.Round(overallGrade, 1)
                },
                Subjects = subjectDetails
            };
        }

        private DateTime GetClassDateTime(DayOfWeek day, TimeSpan time)
        {
            var today = DateTime.UtcNow.Date;
            var daysUntil = ((int)day - (int)today.DayOfWeek + 7) % 7;
            var classDate = today.AddDays(daysUntil);
            return classDate.Add(time);
        }

        private async Task<double?> GetSubjectGrade(Guid studentId, Guid subjectId)
        {
            // Implement based on your grading system
            var random = new Random();
            return random.Next(75, 98);
        }

        private NextClassDto GetNextClass(List<Domain.Entities.Timetable> timetables)
        {
            var now = DateTime.UtcNow;
            var futureClasses = timetables
                .Select(t => new { Timetable = t, DateTime = GetClassDateTime(t.Day, t.StartTime) })
                .Where(x => x.DateTime > now)
                .OrderBy(x => x.DateTime)
                .ToList();

            if (futureClasses.Any())
            {
                var next = futureClasses.First();
                return new NextClassDto
                {
                    Day = next.Timetable.Day.ToString(),
                    Time = FormatTime(next.Timetable.StartTime),
                    Room = next.Timetable.Room ?? "N/A"
                };
            }

            return new NextClassDto
            {
                Day = "No upcoming",
                Time = "",
                Room = ""
            };
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