using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.StudentGrades.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades
{
    public class GetStudentGradesQueryHandler : IRequestHandler<GetStudentGradesQuery, StudentGradesDashboardDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IMapper _mapper;

        public GetStudentGradesQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Subject> subjectRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _submissionRepo = submissionRepo;
            _homeworkRepo = homeworkRepo;
            _subjectRepo = subjectRepo;
            _mapper = mapper;
        }

        public async Task<StudentGradesDashboardDto> Handle(GetStudentGradesQuery request, CancellationToken cancellationToken)
        {
            var student = await _studentRepo.GetByOidAsync(request.StudentId);
            if (student == null)
                throw new Exception("Student not found");

            // Get all subjects for student's class
            var subjects = await _subjectRepo
                .GetAllQueryable()
                .Where(s => s.IsDeleted == false)
                .ToListAsync(cancellationToken);

            // Get all submissions with grades
            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Include(s => s.Homework)
                .Where(s => s.StudentOid == student.Oid && s.Grade.HasValue && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            // Calculate subject grades
            var subjectGrades = new Dictionary<Guid, List<decimal>>();
            foreach (var submission in submissions)
            {
                var subjectId = submission.Homework?.SubjectOid;
                if (subjectId.HasValue)
                {
                    if (!subjectGrades.ContainsKey(subjectId.Value))
                        subjectGrades[subjectId.Value] = new List<decimal>();
                    subjectGrades[subjectId.Value].Add(submission.Grade.Value);
                }
            }

            // Calculate overall grade
            var allGrades = submissions.Select(s => s.Grade.Value).ToList();
            var overallGrade = allGrades.Any() ? (double)allGrades.Average() : 0;
            var gpa = overallGrade / 25; // Convert 0-100 to 0-4 scale

            // Grade trend by month
            var trendData = GetGradeTrend(submissions);

            // Subject performance
            var subjectPerformance = GetSubjectPerformance(subjects, subjectGrades);

            // Detailed subject grades
            var detailedGrades = await GetDetailedSubjectGrades(student.Oid, subjects, cancellationToken);

            // Class rank
            var classRank = await GetClassRank(student.Oid, student.ClassOid, overallGrade, cancellationToken);

            return new StudentGradesDashboardDto
            {
                Title = "myGradesTitle",
                Description = "myGradesDesc",
                OverallGPA = new OverallGpaDto
                {
                    GPA = Math.Round(gpa, 2),
                    OverallGrade = Math.Round(overallGrade, 1)
                },
                GradeTrend = trendData,
                SubjectPerformance = subjectPerformance,
                SubjectDetailedGrades = detailedGrades,
                ClassRank = classRank
            };
        }

        private GradeTrendDto GetGradeTrend(List<HomeworkSubmission> submissions)
        {
            var months = new[] { "Sep", "Oct", "Nov", "Dec", "Jan", "Feb" };
            var monthlyGrades = new List<int>();

            foreach (var month in months)
            {
                var monthIndex = Array.IndexOf(months, month) + 9; // Sep = 9
                var monthGrades = submissions
                    .Where(s => s.GradedAt.HasValue && s.GradedAt.Value.Month == monthIndex)
                    .Select(s => (int)s.Grade.Value)
                    .ToList();

                var avg = monthGrades.Any() ? (int)monthGrades.Average() : 0;
                monthlyGrades.Add(avg);
            }

            return new GradeTrendDto
            {
                Months = months.ToList(),
                Values = monthlyGrades
            };
        }

        private SubjectPerformanceDto GetSubjectPerformance(List<Subject> subjects, Dictionary<Guid, List<decimal>> subjectGrades)
        {
            var subjectNames = new List<string>();
            var subjectAverages = new List<int>();

            foreach (var subject in subjects)
            {
                if (subjectGrades.ContainsKey(subject.Oid))
                {
                    subjectNames.Add(subject.Name);
                    var avg = (int)subjectGrades[subject.Oid].Average();
                    subjectAverages.Add(avg);
                }
            }

            return new SubjectPerformanceDto
            {
                Subjects = subjectNames,
                Grades = subjectAverages
            };
        }

        private async Task<List<SubjectDetailedGradeDto>> GetDetailedSubjectGrades(Guid studentId, List<Subject> subjects, CancellationToken cancellationToken)
        {
            var result = new List<SubjectDetailedGradeDto>();

            foreach (var subject in subjects)
            {
                // Get submissions for this subject
                var submissions = await _submissionRepo
                    .GetAllQueryable()
                    .Include(s => s.Homework)
                    .Where(s => s.StudentOid == studentId &&
                                s.Homework.SubjectOid == subject.Oid &&
                                s.Grade.HasValue &&
                                !s.IsDeleted)
                    .ToListAsync(cancellationToken);

                if (!submissions.Any())
                    continue;

                // Calculate components
                var examGrades = submissions
                    .Where(s => s.Homework.Title.Contains("Exam", StringComparison.OrdinalIgnoreCase))
                    .Select(s => (double)s.Grade.Value)
                    .ToList();

                var assignmentGrades = submissions
                    .Where(s => !s.Homework.Title.Contains("Exam", StringComparison.OrdinalIgnoreCase))
                    .Select(s => (double)s.Grade.Value)
                    .ToList();

                var exams = examGrades.Any() ? examGrades.Average() : 0;
                var assignments = assignmentGrades.Any() ? assignmentGrades.Average() : 0;
                var participation = 90.0; // Placeholder
                var attendance = 92.0; // Placeholder

                // Get exams list
                var examsList = submissions
                    .Where(s => s.Homework.Title.Contains("Exam", StringComparison.OrdinalIgnoreCase))
                    .Select(s => new ExamGradeDto
                    {
                        Title = s.Homework.Title,
                        Date = s.SubmittedAt,
                        Score = s.Grade.Value,
                        TotalMarks = s.Homework.TotalMarks,
                        Percentage = (double)(s.Grade.Value / s.Homework.TotalMarks * 100)
                    })
                    .ToList();

                // Get assignments list
                var assignmentsList = submissions
                    .Where(s => !s.Homework.Title.Contains("Exam", StringComparison.OrdinalIgnoreCase))
                    .Select(s => new AssignmentGradeDto
                    {
                        Title = s.Homework.Title,
                        DueDate = s.Homework.DueDate,
                        Grade = s.Grade,
                        TotalMarks = s.Homework.TotalMarks,
                        Percentage = s.Grade.HasValue ? (double)(s.Grade.Value / s.Homework.TotalMarks * 100) : (double?)null
                    })
                    .ToList();

                result.Add(new SubjectDetailedGradeDto
                {
                    SubjectName = subject.Name,
                    TeacherName = "Teacher Name",
                    Components = new SubjectGradeComponentsDto
                    {
                        Exams = Math.Round(exams, 1),
                        Assignments = Math.Round(assignments, 1),
                        Participation = participation,
                        Attendance = attendance
                    },
                    Exams = examsList,
                    Assignments = assignmentsList
                });
            }

            return result;
        }

        private async Task<ClassRankDto> GetClassRank(Guid studentId, Guid classId, double overallGrade, CancellationToken cancellationToken)
        {
            // Get all students in class with their average grades
            var students = await _studentRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == classId && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var studentGrades = new Dictionary<Guid, double>();

            foreach (var student in students)
            {
                var submissions = await _submissionRepo
                    .GetAllQueryable()
                    .Where(s => s.StudentOid == student.Oid && s.Grade.HasValue && !s.IsDeleted)
                    .ToListAsync(cancellationToken);

                var avg = submissions.Any() ? (double)submissions.Average(s => s.Grade.Value) : 0;
                studentGrades[student.Oid] = avg;
            }

            var sorted = studentGrades.OrderByDescending(x => x.Value).ToList();
            var rank = sorted.FindIndex(x => x.Key == studentId) + 1;

            return new ClassRankDto
            {
                Rank = rank,
                TotalStudents = students.Count
            };
        }
    }
}