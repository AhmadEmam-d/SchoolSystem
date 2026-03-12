using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Sections.Queries.Get
{
    public class GetSectionsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}