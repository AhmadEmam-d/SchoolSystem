using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;

namespace SchoolSystem.Application.Features.Timetable.Commands.Create
{
    public class CreateTimetableCommand : IRequest<Guid>
    {
        public CreateTimetableDto Dto { get; set; }

        public CreateTimetableCommand(CreateTimetableDto dto)
        {
            Dto = dto;
        }
    }
}