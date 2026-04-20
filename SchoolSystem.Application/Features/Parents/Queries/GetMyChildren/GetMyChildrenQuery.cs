// Application/Features/Parents/Queries/GetMyChildren/GetMyChildrenQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;

namespace SchoolSystem.Application.Features.Parents.Queries.GetMyChildren
{
    public class GetMyChildrenQuery : IRequest<MyChildrenDto>
    {
        public Guid ParentUserId { get; set; }
    }
}