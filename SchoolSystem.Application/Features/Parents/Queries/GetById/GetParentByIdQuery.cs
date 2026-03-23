using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Read;

namespace SchoolSystem.Application.Features.Parents.Queries.GetById
{
   
    public record GetParentByIdQuery(Guid Id) : IRequest<ParentDto>;

}
