using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.StudentHomeworks.Queries.GetHomeworkDetails
{
    public class GetHomeworkDetailsQueryHandler : IRequestHandler<GetHomeworkDetailsQuery, HomeworkDetailsDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkAttachment> _attachmentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetHomeworkDetailsQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkAttachment> attachmentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _attachmentRepo = attachmentRepo;
            _submissionRepo = submissionRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<HomeworkDetailsDto> Handle(GetHomeworkDetailsQuery request, CancellationToken cancellationToken)
        {
            // Get homework with includes
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .Include(h => h.Attachments)
                .FirstOrDefaultAsync(h => h.Oid == request.HomeworkId && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            // Get student's submission
            var submission = await _submissionRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(s => s.HomeworkOid == homework.Oid && s.StudentOid == request.StudentId && !s.IsDeleted, cancellationToken);

            // Map using AutoMapper
            var result = _mapper.Map<HomeworkDetailsDto>(homework);
            result.MySubmission = submission != null ? _mapper.Map<StudentSubmissionDto>(submission) : null;

            return result;
        }

        private string GetPriority(DateTime dueDate)
        {
            var daysLeft = (dueDate - DateTime.UtcNow).Days;
            if (daysLeft <= 2) return "high";
            if (daysLeft <= 5) return "medium";
            return "low";
        }

        private string FormatFileSize(long bytes)
        {
            if (bytes >= 1048576)
                return $"{bytes / 1048576.0:F1} MB";
            if (bytes >= 1024)
                return $"{bytes / 1024.0:F1} KB";
            return $"{bytes} B";
        }
    }
}