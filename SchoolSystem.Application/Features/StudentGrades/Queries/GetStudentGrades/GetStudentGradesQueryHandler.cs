using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.StudentGrades.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades
{
    public class GetStudentGradesQueryHandler : IRequestHandler<GetStudentGradesQuery, StudentGradesDashboardDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetStudentGradesQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _submissionRepo = submissionRepo;
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<StudentGradesDashboardDto> Handle(GetStudentGradesQuery request, CancellationToken cancellationToken)
        {
            var student = await _studentRepo.GetByOidAsync(request.StudentId);
            if (student == null)
                throw new Exception("Student not found");

            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Include(s => s.Homework)
                    .ThenInclude(h => h.Subject)
                .Where(s => s.StudentOid == student.Oid && s.Grade.HasValue && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var examResults = await _examResultRepo
                .GetAllQueryable()
                .Include(er => er.Exam)
                    .ThenInclude(e => e.Subject)
                .Where(er => er.StudentOid == student.Oid)
                .OrderByDescending(er => er.Exam.Date)
                .ToListAsync(cancellationToken);

            var subjectNamesFromExams = examResults
                .Where(er => er.Exam?.Subject != null)
                .Select(er => er.Exam.Subject.Name)
                .Distinct();

            var subjectNamesFromHomework = submissions
                .Where(s => s.Homework?.Subject != null)
                .Select(s => s.Homework.Subject.Name)
                .Distinct();

            var allSubjectNames = subjectNamesFromExams
                .Union(subjectNamesFromHomework)
                .ToList();

            var examPercentages = examResults
                .Where(er => er.Percentage.HasValue)
                .Select(er => (double)er.Percentage!.Value)
                .ToList();

            var overallGrade = examPercentages.Any() ? examPercentages.Average() : 0;
            var gpa = overallGrade / 25;

            var trendData = GetGradeTrend(examResults);

            var subjectPerformance = GetSubjectPerformance(allSubjectNames, examResults, submissions);

            var detailedGrades = GetDetailedSubjectGrades(allSubjectNames, examResults, submissions);

            var classRank = await GetClassRank(student.Oid, student.ClassOid, cancellationToken);

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

        private GradeTrendDto GetGradeTrend(List<ExamResult> examResults)
        {
            var grouped = examResults
                .Where(er => er.Percentage.HasValue)
                .GroupBy(er => new { er.Exam.Date.Year, er.Exam.Date.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .ToList();

            var months = grouped
                .Select(g => new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"))
                .ToList();

            var values = grouped
                .Select(g => (int)g.Average(er => (double)er.Percentage!.Value))
                .ToList();

            return new GradeTrendDto
            {
                Months = months,
                Values = values
            };
        }

        private SubjectPerformanceDto GetSubjectPerformance(
            List<string> subjectNames,
            List<ExamResult> examResults,
            List<HomeworkSubmission> submissions)
        {
            var names = new List<string>();
            var averages = new List<int>();

            foreach (var name in subjectNames)
            {
                var examAvg = examResults
                    .Where(er => er.Exam.Subject.Name == name && er.Percentage.HasValue)
                    .Select(er => (double)er.Percentage!.Value)
                    .ToList();

                if (examAvg.Any())
                {
                    names.Add(name);
                    averages.Add((int)examAvg.Average());
                }
            }

            return new SubjectPerformanceDto
            {
                Subjects = names,
                Grades = averages
            };
        }

        private List<SubjectDetailedGradeDto> GetDetailedSubjectGrades(
            List<string> subjectNames,
            List<ExamResult> examResults,
            List<HomeworkSubmission> submissions)
        {
            var result = new List<SubjectDetailedGradeDto>();

            foreach (var subjectName in subjectNames)
            {
                var subjectExams = examResults
                    .Where(er => er.Exam.Subject.Name == subjectName)
                    .ToList();

                var subjectSubmissions = submissions
                    .Where(s => s.Homework.Subject.Name == subjectName)
                    .ToList();

                if (!subjectExams.Any() && !subjectSubmissions.Any())
                    continue;

                var examAvg = subjectExams.Any()
                    ? subjectExams.Where(er => er.Percentage.HasValue)
                        .Average(er => (double)er.Percentage!.Value)
                    : 0;

                var assignmentAvg = subjectSubmissions.Any()
                    ? (double)subjectSubmissions.Average(s => s.Grade!.Value)
                    : 0;

                var examsList = subjectExams.Select(er => new ExamGradeDto
                {
                    Title = er.Exam.Name,
                    Date = er.SubmittedAt ?? DateTime.UtcNow,
                    Score = er.Score,
                    TotalMarks = er.Exam.MaxScore,
                    Percentage = er.Percentage.HasValue ? (double)er.Percentage.Value : 0
                }).ToList();

                var assignmentsList = subjectSubmissions.Select(s => new AssignmentGradeDto
                {
                    Title = s.Homework.Title,
                    DueDate = s.Homework.DueDate,
                    Grade = s.Grade,
                    TotalMarks = s.Homework.TotalMarks,
                    Percentage = s.Grade.HasValue
                        ? (double)(s.Grade.Value / s.Homework.TotalMarks * 100)
                        : null
                }).ToList();

                result.Add(new SubjectDetailedGradeDto
                {
                    SubjectName = subjectName,
                    TeacherName = "Teacher Name",
                    Components = new SubjectGradeComponentsDto
                    {
                        Exams = Math.Round(examAvg, 1),
                        Assignments = Math.Round(assignmentAvg, 1),
                        Participation = 0,
                        Attendance = 0
                    },
                    Exams = examsList,
                    Assignments = assignmentsList
                });
            }

            return result;
        }

        private async Task<ClassRankDto> GetClassRank(
            Guid studentId,
            Guid classId,
            CancellationToken cancellationToken)
        {
            var classStudentIds = await _studentRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == classId && !s.IsDeleted)
                .Select(s => s.Oid)
                .ToListAsync(cancellationToken);

            var allClassAverages = await _examResultRepo
                .GetAllQueryable()
                .Where(er => er.StudentOid.HasValue && classStudentIds.Contains(er.StudentOid.Value) && er.Percentage.HasValue).GroupBy(er => er.StudentOid)
                .Select(g => new
                {
                    StudentOid = g.Key,
                    Average = g.Average(er => (double)er.Percentage!.Value)
                })
                .ToListAsync(cancellationToken);

            var allRanked = classStudentIds
                .Select(id => new
                {
                    StudentOid = id,
                    Average = allClassAverages.FirstOrDefault(a => a.StudentOid == id)?.Average ?? 0
                })
                .OrderByDescending(x => x.Average)
                .ToList();

            var rank = allRanked.FindIndex(x => x.StudentOid == studentId) + 1;

            return new ClassRankDto
            {
                Rank = rank > 0 ? rank : classStudentIds.Count,
                TotalStudents = classStudentIds.Count
            };
        }
    }
}