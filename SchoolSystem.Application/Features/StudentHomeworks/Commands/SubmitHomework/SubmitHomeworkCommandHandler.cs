using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.StudentHomeworks.Commands.SubmitHomework
{
    public class SubmitHomeworkCommandHandler : IRequestHandler<SubmitHomeworkCommand, bool>
    {
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Student> _studentRepo;

        public SubmitHomeworkCommandHandler(
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Student> studentRepo)
        {
            _submissionRepo = submissionRepo;
            _homeworkRepo = homeworkRepo;
            _studentRepo = studentRepo;
        }

        public async Task<bool> Handle(SubmitHomeworkCommand request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo.GetByOidAsync(request.HomeworkId);
            if (homework == null)
                throw new Exception("Homework not found");

            var student = await _studentRepo.GetByOidAsync(request.StudentId);
            if (student == null)
                throw new Exception("Student not found");

            var existingSubmission = await _submissionRepo.GetAllQueryable()
                .FirstOrDefaultAsync(s => s.HomeworkOid == request.HomeworkId && s.StudentOid == request.StudentId, cancellationToken);

            var now = DateTime.UtcNow;
            var isLate = homework.DueDate < now && !homework.AllowLateSubmissions;

            if (existingSubmission != null)
            {
                existingSubmission.Content = request.SubmissionText;
                existingSubmission.AttachmentUrl = request.AttachmentUrl;
                existingSubmission.SubmittedAt = now;
                existingSubmission.Status = isLate ? SubmissionStatus.Late : SubmissionStatus.Submitted;
                await _submissionRepo.UpdateAsync(existingSubmission);
            }
            else
            {
                var submission = new HomeworkSubmission
                {
                    Oid = Guid.NewGuid(),
                    HomeworkOid = request.HomeworkId,
                    StudentOid = request.StudentId,
                    Content = request.SubmissionText,
                    AttachmentUrl = request.AttachmentUrl,
                    SubmittedAt = now,
                    Status = isLate ? SubmissionStatus.Late : SubmissionStatus.Submitted,
                    CreatedAt = now
                };
                await _submissionRepo.AddAsync(submission);
            }

            return true;
        }
    }
}