using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.Get 
{
    public class GetClassesQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}