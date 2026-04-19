using MediatR;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using System;

namespace SchoolSystem.Application.Features.StudentHomeworks.Commands.SubmitHomework
{
    public class SubmitHomeworkCommand : IRequest<bool>
    {
        public Guid HomeworkId { get; set; }
        public Guid StudentId { get; set; }
        public string SubmissionText { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}