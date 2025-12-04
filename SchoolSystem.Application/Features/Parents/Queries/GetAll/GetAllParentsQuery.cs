using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Parents.Queries.GetAll
{
  

    public record GetAllParentsQuery() : IRequest<IEnumerable<ParentDto>>;

}
