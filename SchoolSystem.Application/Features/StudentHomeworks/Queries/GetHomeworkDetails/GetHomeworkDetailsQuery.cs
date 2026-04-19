using MediatR;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using System;

namespace SchoolSystem.Application.Features.StudentHomeworks.Queries.GetHomeworkDetails
{
    public class GetHomeworkDetailsQuery : IRequest<HomeworkDetailsDto>
    {
        public Guid HomeworkId { get; set; }
        public Guid StudentId { get; set; }
    }
}