// Application/Features/Homeworks/Queries/GetGradeReport/GetHomeworkGradeReportQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetGradeReport
{
    public class GetHomeworkGradeReportQueryHandler : IRequestHandler<GetHomeworkGradeReportQuery, HomeworkGradeReportDto>
    {
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;

        public GetHomeworkGradeReportQueryHandler(
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Homework> homeworkRepo)
        {
            _submissionRepo = submissionRepo;
            _homeworkRepo = homeworkRepo;
        }

        public async Task<HomeworkGradeReportDto> Handle(GetHomeworkGradeReportQuery request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo.GetByOidAsync(request.HomeworkId);
            if (homework == null)
                throw new Exception("Homework not found");

            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Include(s => s.Student)
                .Where(s => s.HomeworkOid == request.HomeworkId && !s.IsDeleted && s.Grade.HasValue)
                .ToListAsync(cancellationToken);

            var gradedSubmissions = submissions.Where(s => s.Grade.HasValue).ToList();
            var totalSubmissions = submissions.Count;
            var gradedCount = gradedSubmissions.Count;

            // تحويل decimal إلى double
            double totalMarks = (double)homework.TotalMarks;

            var averageGrade = gradedCount > 0 ? gradedSubmissions.Average(s => (double)s.Grade.Value) : 0;
            var highestGrade = gradedCount > 0 ? gradedSubmissions.Max(s => s.Grade.Value) : 0;
            var lowestGrade = gradedCount > 0 ? gradedSubmissions.Min(s => s.Grade.Value) : 0;

            // ✅ إصلاح: استخدام totalMarks (double) بدلاً من homework.TotalMarks (decimal)
            var passRate = gradedCount > 0 ? (double)gradedSubmissions.Count(s => (double)s.Grade.Value >= totalMarks * 0.6) / gradedCount * 100 : 0;

            var gradeDistribution = new Dictionary<string, int>();
            var ranges = new[] { "0-59", "60-69", "70-79", "80-89", "90-100" };
            foreach (var range in ranges)
                gradeDistribution[range] = 0;

            foreach (var sub in gradedSubmissions)
            {
                // ✅ إصلاح: استخدام totalMarks (double)
                var percentage = (double)sub.Grade.Value / totalMarks * 100;
                if (percentage < 60) gradeDistribution["0-59"]++;
                else if (percentage < 70) gradeDistribution["60-69"]++;
                else if (percentage < 80) gradeDistribution["70-79"]++;
                else if (percentage < 90) gradeDistribution["80-89"]++;
                else gradeDistribution["90-100"]++;
            }

            var studentGrades = gradedSubmissions
                .OrderByDescending(s => s.Grade)
                .Select((s, index) => new StudentGradeDto
                {
                    Rank = index + 1,
                    StudentName = s.Student.FullName,
                    Grade = s.Grade,
                    // ✅ إصلاح: استخدام totalMarks (double)
                    LetterGrade = GetLetterGrade((double)s.Grade.Value / totalMarks * 100),
                    Performance = (double)s.Grade.Value >= totalMarks * 0.8 ? "Above Average" : "Below Average"
                })
                .ToList();

            return new HomeworkGradeReportDto
            {
                AverageGrade = Math.Round(averageGrade, 1),
                HighestGrade = highestGrade,
                LowestGrade = lowestGrade,
                PassRate = Math.Round(passRate, 1),
                TotalSubmissions = totalSubmissions,
                GradedCount = gradedCount,
                GradeDistribution = gradeDistribution,
                StudentGrades = studentGrades
            };
        }

        private string GetLetterGrade(double percentage)
        {
            if (percentage >= 90) return "A";
            if (percentage >= 75) return "B";
            if (percentage >= 60) return "C";
            if (percentage >= 50) return "D";
            return "F";
        }
    }
}