using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetByOid
{
    public class GetLessonByIdQuery : IRequest<LessonResponseDto>
    {
        public Guid Oid { get; set; }

        public GetLessonByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}
