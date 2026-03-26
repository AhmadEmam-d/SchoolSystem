using MediatR;
using SchoolSystem.Application.Features.Timetable.DTOs;
using System;

namespace SchoolSystem.Application.Features.Timetable.Commands.Update
{
    public class UpdateTimetableCommand : IRequest<bool>
    {
        public UpdateTimetableDto Dto { get; set; }

        public UpdateTimetableCommand(UpdateTimetableDto dto)
        {
            Dto = dto;
        }
    }
}