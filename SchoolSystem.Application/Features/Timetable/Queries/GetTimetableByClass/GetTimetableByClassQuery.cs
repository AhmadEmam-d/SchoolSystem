using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetTimetableByClass
{
    public class GetTimetableByClassQuery : IRequest<TimetableByClassDto>
    {
        public Guid ClassOid { get; set; }

        public GetTimetableByClassQuery(Guid classOid)
        {
            ClassOid = classOid;
        }
    }
}
