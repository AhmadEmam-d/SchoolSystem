using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Queries.GetByOid
{
    public record GetClassByIdQuery(Guid Id) : IRequest<ClassResponseDto>;

}
