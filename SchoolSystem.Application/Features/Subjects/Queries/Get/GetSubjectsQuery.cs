using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Subjects.Queries.Get
{
    public class GetSubjectsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}