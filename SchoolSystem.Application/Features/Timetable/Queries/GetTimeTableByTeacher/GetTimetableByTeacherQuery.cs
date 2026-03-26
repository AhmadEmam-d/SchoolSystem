using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetTimeTableByTeacher
{
    public class GetTimetableByTeacherQuery : IRequest<TimetableByTeacherDto>
    {
        public Guid TeacherOid { get; set; }

        public GetTimetableByTeacherQuery(Guid teacherOid)
        {
            TeacherOid = teacherOid;
        }
    }
}