using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetById
{
    public class GetHomeworkByIdQueryHandler : IRequestHandler<GetHomeworkByIdQuery, HomeworkDetailResponseDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IMapper _mapper;

        public GetHomeworkByIdQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _studentRepo = studentRepo;
            _submissionRepo = submissionRepo;
            _mapper = mapper;
        }

        public async Task<HomeworkDetailResponseDto> Handle(GetHomeworkByIdQuery request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .Include(h => h.Attachments)
                .FirstOrDefaultAsync(h => h.Oid == request.Id && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            // Get all students in the class
            var students = await _studentRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == homework.ClassOid && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var totalStudents = students.Count;

            // Get all submissions for this homework
            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Where(s => s.HomeworkOid == homework.Oid && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var submittedCount = submissions.Count;
            var gradedCount = submissions.Count(s => s.Grade.HasValue);
            var pendingCount = submissions.Count(s => !s.Grade.HasValue && s.Status != SubmissionStatus.Graded);

            // Calculate late submissions
            var now = DateTime.UtcNow;
            var lateCount = submissions.Count(s => s.SubmittedAt > homework.DueDate);

            var result = _mapper.Map<HomeworkDetailResponseDto>(homework);
            result.SubmittedCount = submittedCount;
            result.TotalStudents = totalStudents;
            result.PendingCount = pendingCount;
            result.GradedCount = gradedCount;
            result.LateCount = lateCount;

            return result;
        }
    }
}