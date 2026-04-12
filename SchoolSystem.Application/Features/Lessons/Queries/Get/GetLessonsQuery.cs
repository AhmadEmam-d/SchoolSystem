// Application/Features/Lessons/Queries/Get/GetLessonsQuery.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Lessons.Queries.Get
{
    public class GetLessonsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; }
    }
}