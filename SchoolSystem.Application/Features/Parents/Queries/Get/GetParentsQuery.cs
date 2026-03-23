using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.Get
{
    public class GetParentsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}