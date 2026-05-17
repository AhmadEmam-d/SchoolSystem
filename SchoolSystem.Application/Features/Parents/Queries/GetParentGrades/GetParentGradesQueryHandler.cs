// Application/Features/Parents/Queries/GetParentGrades/GetParentGradesQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentGrades
{
    public class GetParentGradesQueryHandler
        : IRequestHandler<GetParentGradesQuery, List<StudentGradesFullDto>>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;

        public GetParentGradesQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _examResultRepo = examResultRepo;
            _submissionRepo = submissionRepo;
        }

        public async Task<List<StudentGradesFullDto>> Handle(
            GetParentGradesQuery request,
            CancellationToken cancellationToken)
        {
            var parent = await _parentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(p => p.UserId == request.ParentUserId, cancellationToken);

            if (parent == null)
                throw new UnauthorizedAccessException("Parent not found.");

            var students = await _studentRepo.GetAllQueryable()
                .Include(s => s.Class)
                .Where(s => s.ParentOid == parent.Oid)
                .ToListAsync(cancellationToken);

            if (!students.Any())
                return new List<StudentGradesFullDto>();

            var studentIds = students.Select(s => s.Oid).ToList();

            var allExamResults = await _examResultRepo.GetAllQueryable()
                .Include(er => er.Exam)
                .ThenInclude(e => e!.Subject)
                .Where(er => er.StudentOid.HasValue && studentIds.Contains(er.StudentOid.Value))
                .OrderByDescending(er => er.Exam!.Date)
                .ToListAsync(cancellationToken);

            var allSubmissions = await _submissionRepo.GetAllQueryable()
                .Include(s => s.Homework)
                    .ThenInclude(h => h.Subject)
                .Where(s => studentIds.Contains(s.StudentOid) && s.Grade.HasValue)
                .ToListAsync(cancellationToken);

            var allClassIds = students.Select(s => s.ClassOid).Distinct().ToList();

            var allClassmateIds = await _studentRepo.GetAllQueryable()
                .Where(s => allClassIds.Contains(s.ClassOid) && !s.IsDeleted)
                .Select(s => new { s.Oid, s.ClassOid })
                .ToListAsync(cancellationToken);

            var allClassmateStudentIds = allClassmateIds.Select(x => x.Oid).ToList();

            var allClassAverages = await _examResultRepo.GetAllQueryable()
                .Where(er => er.StudentOid.HasValue && allClassmateStudentIds.Contains(er.StudentOid.Value) && er.Percentage.HasValue).GroupBy(er => er.StudentOid)
                .Select(g => new
                {
                    StudentOid = g.Key,
                    Average = g.Average(er => (double)er.Percentage!.Value)
                })
                .ToListAsync(cancellationToken);

            var result = new List<StudentGradesFullDto>();

            foreach (var student in students)
            {
                var examResults = allExamResults
                    .Where(er => er.StudentOid == student.Oid)
                    .ToList();

                var submissions = allSubmissions
                    .Where(s => s.StudentOid == student.Oid)
                    .ToList();

                var classmateIds = allClassmateIds
                    .Where(x => x.ClassOid == student.ClassOid)
                    .Select(x => x.Oid)
                    .ToList();

                var ranked = classmateIds
                    .Select(id => new
                    {
                        StudentOid = id,
                        Average = allClassAverages
                            .FirstOrDefault(a => a.StudentOid == id)?.Average ?? 0
                    })
                    .OrderByDescending(x => x.Average)
                    .ToList();

                int classRank = ranked.FindIndex(x => x.StudentOid == student.Oid) + 1;
                int totalStudents = classmateIds.Count;

                double overallAvg = 0;
                var examPercentages = examResults
                    .Where(er => er.Percentage.HasValue)
                    .Select(er => (double)er.Percentage!.Value)
                    .ToList();

                var homeworkPercentages = submissions
                    .Where(s => s.Grade.HasValue && s.Homework?.TotalMarks > 0)
                    .Select(s => (double)(s.Grade!.Value / s.Homework!.TotalMarks) * 100) 
                    .ToList();

                var allPercentages = examPercentages.Concat(homeworkPercentages).ToList();

                overallAvg = allPercentages.Any() ? allPercentages.Average() : 0;

                var gpa = Math.Round(overallAvg / 25, 2);

                string letterGrade = GetLetterGrade(overallAvg);

                var gradeTrend = examResults
                    .Where(er => er.Percentage.HasValue)
                    .GroupBy(er => new { er.Exam!.Date.Year, er.Exam!.Date.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new GradeTrendDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                        AverageScore = g.Average(er => (double)er.Percentage!.Value)
                    })
                    .ToList();

                var allSubjectNames = examResults
                    .Where(er => er.Exam?.Subject != null)
                    .Select(er => er.Exam!.Subject!.Name)
                    .Union(submissions
                        .Where(s => s.Homework?.Subject != null)
                        .Select(s => s.Homework!.Subject!.Name))
                    .Distinct()
                    .ToList();

                var subjectPerformance = allSubjectNames.Select(subjectName =>
                {
                    var subjectExams = examResults
                        .Where(er => er.Exam!.Subject!.Name == subjectName)
                        .ToList();

                    var examItems = subjectExams.Select(er => new ExamGradeItemDto
                    {
                        ExamName = er.Exam!.Name,
                        Score = er.Score,
                        MaxScore = er.Exam!.MaxScore
                    }).ToList();

                    double subjectExamAvg = subjectExams.Any(er => er.Percentage.HasValue)
                        ? subjectExams.Where(er => er.Percentage.HasValue).Average(er => (double)er.Percentage!.Value)
                        : 0;

                    var subjectSubmissions = submissions
                        .Where(s => s.Homework!.Subject!.Name == subjectName)
                        .ToList();

                    double subjectHomeworkAvg = subjectSubmissions.Any()
                        ? subjectSubmissions.Average(s => (double)(s.Grade!.Value / s.Homework!.TotalMarks) * 100) 
                        : 0;

                    double subjectAvg = 0;
                    if (subjectExamAvg > 0 && subjectHomeworkAvg > 0)
                        subjectAvg = (subjectExamAvg + subjectHomeworkAvg) / 2;
                    else if (subjectExamAvg > 0)
                        subjectAvg = subjectExamAvg;
                    else
                        subjectAvg = subjectHomeworkAvg;

                    string subjectLetter = GetLetterGrade(subjectAvg);

                    var assignmentItems = subjectSubmissions
                        .Select(s => new AssignmentGradeItemDto
                        {
                            AssignmentName = s.Homework.Title,
                            Score = s.Grade, 
                            MaxScore = s.Homework.TotalMarks
                        }).ToList();

                    return new SubjectPerformanceDetailDto
                    {
                        SubjectName = subjectName,
                        SubjectAverage = Math.Round(subjectAvg, 1),
                        LetterGrade = subjectLetter,
                        Exams = examItems,
                        Assignments = assignmentItems
                    };
                }).ToList();

                result.Add(new StudentGradesFullDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName,
                    Summary = new GradeSummaryDto
                    {
                        GPA = gpa,
                        OverallGrade = Math.Round(overallAvg, 1),
                        LetterGrade = letterGrade,
                        ClassRank = classRank > 0 ? classRank : totalStudents,
                        TotalStudentsInClass = totalStudents
                    },
                    GradeTrend = gradeTrend,
                    SubjectPerformance = subjectPerformance
                });
            }

            return result;
        }

        private string GetLetterGrade(double percentage)
        {
            if (percentage >= 90) return "A";
            if (percentage >= 80) return "B";
            if (percentage >= 70) return "C";
            if (percentage >= 60) return "D";
            return "F";
        }
    }
}