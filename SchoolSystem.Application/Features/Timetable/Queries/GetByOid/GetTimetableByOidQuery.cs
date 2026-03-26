using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetById
{
    public class GetTimetableByOidQuery : IRequest<TimetableDto>
    {
        public Guid Oid { get; set; }

        public GetTimetableByOidQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}