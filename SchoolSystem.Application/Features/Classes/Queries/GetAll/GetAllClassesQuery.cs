using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Queries.GetAll
{
    public record GetAllClassesQuery() : IRequest<IEnumerable<ClassResponseDto>>;

}
