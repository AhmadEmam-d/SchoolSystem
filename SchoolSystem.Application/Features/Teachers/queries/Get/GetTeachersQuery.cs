using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Teachers.queries.Get
{
    public class GetTeachersQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}