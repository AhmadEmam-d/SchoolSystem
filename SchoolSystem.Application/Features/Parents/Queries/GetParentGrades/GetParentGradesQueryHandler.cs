using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentGrades
{
    public class GetParentGradesQueryHandler
        : IRequestHandler<GetParentGradesQuery, List<StudentGradesFullDto>>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<StudentReport> _studentReportRepo;

        public GetParentGradesQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<StudentReport> studentReportRepo)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _examResultRepo = examResultRepo;
            _submissionRepo = submissionRepo;
            _studentReportRepo = studentReportRepo;
        }

        public async Task<List<StudentGradesFullDto>> Handle(
            GetParentGradesQuery request,
            CancellationToken cancellationToken)
        {
            // ── 1. Get parent ──
            var parent = await _parentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(
                    p => p.UserId == request.ParentUserId,
                    cancellationToken);

            if (parent == null)
                throw new UnauthorizedAccessException("Parent not found.");

            // ── 2. Get all children of this parent ──
            var students = await _studentRepo.GetAllQueryable()
                .Include(s => s.Class)
                .Where(s => s.ParentOid == parent.Oid)
                .ToListAsync(cancellationToken);

            if (!students.Any())
                return new List<StudentGradesFullDto>();

            var studentIds = students.Select(s => s.Oid).ToList();

            // ── 3. Fetch all exam results for all children in one query ──
            var allExamResults = await _examResultRepo.GetAllQueryable()
                .Include(er => er.Exam)
                    .ThenInclude(e => e.Subject)
                .Where(er => studentIds.Contains(er.StudentOid))
                .OrderByDescending(er => er.Exam.Date)
                .ToListAsync(cancellationToken);

            // ── 4. Fetch all graded submissions for all children in one query ──
            var allSubmissions = await _submissionRepo.GetAllQueryable()
                .Include(s => s.Homework)
                    .ThenInclude(h => h.Subject)
                .Where(s => studentIds.Contains(s.StudentOid) && s.Grade.HasValue)
                .ToListAsync(cancellationToken);

            // ── 5. Fetch all student reports for all children in one query ──
            var allReports = await _studentReportRepo.GetAllQueryable()
                .Where(r => studentIds.Contains(r.StudentOid))
                .OrderByDescending(r => r.GeneratedAt)
                .ToListAsync(cancellationToken);

            // ── 6. Build response per child ──
            var result = new List<StudentGradesFullDto>();

            foreach (var student in students)
            {
                // Latest report for this student
                var report = allReports
                    .FirstOrDefault(r => r.StudentOid == student.Oid);

                // Exam results for this student
                var examResults = allExamResults
                    .Where(er => er.StudentOid == student.Oid)
                    .ToList();

                // Submissions for this student
                var submissions = allSubmissions
                    .Where(s => s.StudentOid == student.Oid)
                    .ToList();

                // ── Class rank: order classmates by AverageGrade ──
                var classmateIds = await _studentRepo.GetAllQueryable()
                    .Where(s => s.ClassOid == student.ClassOid)
                    .Select(s => s.Oid)
                    .ToListAsync(cancellationToken);

                var classmateReports = allReports
                    .Where(r => classmateIds.Contains(r.StudentOid))
                    .OrderByDescending(r => r.AverageGrade)
                    .Select(r => r.StudentOid)
                    .ToList();

                int classRank = classmateReports.IndexOf(student.Oid) + 1;
                int totalStudents = classmateIds.Count;

                // ── Most recent letter grade ──
                string letterGrade = examResults
                    .FirstOrDefault(er => !string.IsNullOrEmpty(er.Grade))
                    ?.Grade ?? "N/A";

                // ── Grade trend: group by month, read Percentage from DB ──
                var gradeTrend = examResults
                    .Where(er => er.Percentage.HasValue)
                    .GroupBy(er => new
                    {
                        er.Exam.Date.Year,
                        er.Exam.Date.Month
                    })
                    .OrderBy(g => g.Key.Year)
                    .ThenBy(g => g.Key.Month)
                    .Select(g => new GradeTrendDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                        AverageScore = g.Average(er => (double)er.Percentage!.Value)
                    })
                    .ToList();

                // Collect all subject names from BOTH exams and assignments
                var subjectNamesFromExams = examResults
                    .Select(er => er.Exam.Subject.Name)
                    .Distinct();

                var subjectNamesFromAssignments = submissions
                    .Select(s => s.Homework.Subject.Name)
                    .Distinct();

                var allSubjectNames = subjectNamesFromExams
                    .Union(subjectNamesFromAssignments)
                    .ToList();

                var subjectPerformance = allSubjectNames.Select(subjectName =>
                {
                    var subjectExams = examResults
                        .Where(er => er.Exam.Subject.Name == subjectName)
                        .ToList();

                    var examItems = subjectExams
                        .Select(er => new ExamGradeItemDto
                        {
                            ExamName = er.Exam.Name,
                            Score = er.Score,
                            MaxScore = er.Exam.MaxScore
                        }).ToList();

                    string subjectLetter = subjectExams
                        .OrderByDescending(er => er.Exam.Date)
                        .FirstOrDefault(er => !string.IsNullOrEmpty(er.Grade))
                        ?.Grade ?? "N/A";

                    double subjectAvg = subjectExams
                        .Where(er => er.Percentage.HasValue)
                        .Select(er => (double)er.Percentage!.Value)
                        .DefaultIfEmpty(0)
                        .Average();

                    var assignmentItems = submissions
                        .Where(s => s.Homework.Subject.Name == subjectName)
                        .Select(s => new AssignmentGradeItemDto
                        {
                            AssignmentName = s.Homework.Title,
                            Score = s.Grade,
                            MaxScore = s.Homework.TotalMarks
                        }).ToList();

                    return new SubjectPerformanceDetailDto
                    {
                        SubjectName = subjectName,
                        SubjectAverage = subjectAvg,
                        LetterGrade = subjectLetter,
                        Exams = examItems,
                        Assignments = assignmentItems
                    };
                })
                .ToList();

                result.Add(new StudentGradesFullDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName,
                    Summary = new GradeSummaryDto
                    {
                        GPA = report?.AverageGrade ?? 0,
                        OverallGrade = report?.AverageGrade ?? 0,
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
    }
}
