using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetAll
{
    public class GetAllTimetablesQuery : IRequest<List<TimetableDto>>
    {
    }
}