// Application/Features/Homeworks/Queries/GetById/GetHomeworkByIdQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetById
{
    public class GetHomeworkByIdQuery : IRequest<HomeworkDetailResponseDto>
    {
        public Guid Id { get; set; }

        public GetHomeworkByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}