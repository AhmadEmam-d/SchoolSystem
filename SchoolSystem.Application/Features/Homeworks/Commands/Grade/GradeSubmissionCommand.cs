// Application/Features/Homeworks/Commands/Grade/GradeSubmissionCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Grade
{
    public class GradeSubmissionCommand : IRequest<bool>
    {
        public Guid SubmissionId { get; set; }
        public decimal Grade { get; set; }
        public string? Feedback { get; set; }
    }
}