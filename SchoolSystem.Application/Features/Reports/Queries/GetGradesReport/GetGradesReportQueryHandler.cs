using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetGradesReport
{
    public class GetGradesReportQueryHandler : IRequestHandler<GetGradesReportQuery, GradesReportDto>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetGradesReportQueryHandler(
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _examResultRepo = examResultRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<GradesReportDto> Handle(GetGradesReportQuery request, CancellationToken cancellationToken)
        {
            var examResults = await _examResultRepo.GetAllQueryable()
                .Select(r => new
                {
                    r.Oid,
                    r.Percentage,
                    r.IsPassed,
                    r.StudentOid,
                    SubjectName = r.Exam.Subject.Name,
                    StudentName = r.Student.FullName
                })
                .ToListAsync(cancellationToken);

            var students = await _studentRepo.GetAllQueryable().ToListAsync(cancellationToken);
            var totalStudents = students.Count;

            var avgGrade = examResults.Any() ? examResults.Average(r => r.Percentage ?? 0) : 0;

            var subjectPerformance = examResults
                .GroupBy(r => r.SubjectName)
                .Select(g => new SubjectPerformanceDto
                {
                    SubjectName = g.Key,
                    Average = Math.Round(g.Average(r => r.Percentage ?? 0), 1),
                    Highest = g.Max(r => r.Percentage ?? 0),
                    Lowest = g.Min(r => r.Percentage ?? 0),
                    TotalStudents = g.Select(r => r.StudentOid).Distinct().Count(),
                    PassRate = Math.Round((double)g.Count(r => r.IsPassed) / g.Count() * 100, 1)
                })
                .ToList();

            var topStudents = examResults
                .GroupBy(r => r.StudentOid)
                .Select(g => new
                {
                    StudentName = g.FirstOrDefault()?.StudentName ?? "Unknown",
                    Average = g.Average(r => r.Percentage ?? 0)
                })
                .OrderByDescending(s => s.Average)
                .Take(5)
                .Select(s => new TopStudentDto
                {
                    StudentName = s.StudentName,
                    ClassName = "N/A",
                    Average = Math.Round(s.Average, 1)
                })
                .ToList();

            var highestGrades = examResults
                .GroupBy(r => r.SubjectName)
                .Select(g => new HighestGradeBySubjectDto
                {
                    SubjectName = g.Key,
                    HighestScore = g.Max(r => r.Percentage ?? 0),
                    StudentName = g.OrderByDescending(r => r.Percentage).FirstOrDefault()?.StudentName ?? "N/A"
                })
                .ToList();

            return new GradesReportDto
            {
                TotalStudents = totalStudents,
                AverageGrade = Math.Round(avgGrade, 1),
                TopPerformersCount = topStudents.Count,
                TopPerformersPercentage = totalStudents > 0 ? (int)((double)topStudents.Count / totalStudents * 100) : 0,
                SubjectPerformance = subjectPerformance,
                TopStudents = topStudents,
                HighestGradesBySubject = highestGrades
            };
        }
    }
}