using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetStudentWeeklySchedule
{
    public class GetStudentWeeklyScheduleQuery : IRequest<StudentWeeklyScheduleDto>
    {
        public Guid StudentId { get; set; }
        public DateTime? WeekStartDate { get; set; }

        public GetStudentWeeklyScheduleQuery(Guid studentId, DateTime? weekStartDate = null)
        {
            StudentId = studentId;
            WeekStartDate = weekStartDate;
        }
    }
}