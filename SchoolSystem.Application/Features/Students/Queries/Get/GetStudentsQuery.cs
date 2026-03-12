using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Students.Queries.Get
{
    public class GetStudentsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}