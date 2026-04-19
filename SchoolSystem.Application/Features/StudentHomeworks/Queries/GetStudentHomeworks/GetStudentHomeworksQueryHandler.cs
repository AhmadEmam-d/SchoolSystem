using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.StudentHomeworks.Queries.GetStudentHomeworks
{
    public class GetStudentHomeworksQueryHandler : IRequestHandler<GetStudentHomeworksQuery, StudentHomeworkDashboardDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetStudentHomeworksQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _submissionRepo = submissionRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<StudentHomeworkDashboardDto> Handle(GetStudentHomeworksQuery request, CancellationToken cancellationToken)
        {
            // Get student
            var student = await _studentRepo.GetByOidAsync(request.StudentId);
            if (student == null)
                throw new Exception("Student not found");

            // Get all homeworks for student's class
            var homeworks = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .Include(h => h.Attachments)
                .Where(h => h.ClassOid == student.ClassOid && !h.IsDeleted)
                .ToListAsync(cancellationToken);

            // Get student's submissions
            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Where(s => s.StudentOid == student.Oid && !s.IsDeleted)
                .ToDictionaryAsync(s => s.HomeworkOid, s => s, cancellationToken);

            var now = DateTime.UtcNow;
            var homeworkSummaries = new List<HomeworkSummaryDto>();
            int pending = 0, submitted = 0, graded = 0;

            foreach (var homework in homeworks)
            {
                var hasSubmission = submissions.TryGetValue(homework.Oid, out var submission);
                var isOverdue = homework.DueDate < now;
                string status;
                decimal? grade = null;

                if (hasSubmission)
                {
                    if (submission.Grade.HasValue)
                    {
                        status = "Graded";
                        graded++;
                        grade = submission.Grade;
                    }
                    else
                    {
                        status = "Submitted";
                        submitted++;
                    }
                }
                else if (isOverdue)
                {
                    status = "Late";
                    pending++;
                }
                else
                {
                    status = "Pending";
                    pending++;
                }

                // Map using AutoMapper
                var summary = _mapper.Map<HomeworkSummaryDto>(homework);
                summary.Status = status;
                summary.Grade = grade;
                summary.IsOverdue = isOverdue && !hasSubmission;

                // Filter by status if specified
                if (!string.IsNullOrEmpty(request.Status) && request.Status != "All" && status != request.Status)
                    continue;

                homeworkSummaries.Add(summary);
            }

            return new StudentHomeworkDashboardDto
            {
                Title = "Homework",
                Subtitle = "trackSubmitAssignments",
                Stats = new HomeworkStatsCardDto
                {
                    Pending = pending,
                    Submitted = submitted,
                    Graded = graded
                },
                Homeworks = homeworkSummaries
            };
        }
    }
}