// Application/Features/Homeworks/Commands/Grade/GradeSubmissionCommandHandler.cs
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Grade
{
    public class GradeSubmissionCommandHandler : IRequestHandler<GradeSubmissionCommand, bool>
    {
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;

        public GradeSubmissionCommandHandler(IGenericRepository<HomeworkSubmission> submissionRepo)
        {
            _submissionRepo = submissionRepo;
        }

        public async Task<bool> Handle(GradeSubmissionCommand request, CancellationToken cancellationToken)
        {
            var submission = await _submissionRepo.GetByOidAsync(request.SubmissionId);
            if (submission == null)
                throw new Exception("Submission not found");

            submission.Grade = request.Grade;
            submission.Feedback = request.Feedback;
            submission.GradedAt = DateTime.UtcNow;
            submission.Status = SubmissionStatus.Graded;
            submission.UpdatedAt = DateTime.UtcNow;

            await _submissionRepo.UpdateAsync(submission);

            return true;
        }
    }
}