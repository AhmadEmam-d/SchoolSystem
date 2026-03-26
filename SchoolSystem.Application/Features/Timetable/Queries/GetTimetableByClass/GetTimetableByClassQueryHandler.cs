using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetTimetableByClass
{
    public class GetTimetableByClassQueryHandler : IRequestHandler<GetTimetableByClassQuery, TimetableByClassDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IMapper _mapper;

        public GetTimetableByClassQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Timetable> timetableRepo,
            IGenericRepository<Class> classRepo,
            IMapper mapper)
        {
            _timetableRepo = timetableRepo;
            _classRepo = classRepo;
            _mapper = mapper;
        }

        public async Task<TimetableByClassDto> Handle(GetTimetableByClassQuery request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.ClassOid);
            if (classEntity == null)
                throw new Exception($"Class with ID {request.ClassOid} not found");

            var timetables = await _timetableRepo.GetAllQueryable()
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.ClassOid == request.ClassOid)
                .OrderBy(t => t.Day)
                .ThenBy(t => t.StartTime)
                .ToListAsync(cancellationToken);

            var days = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday" };
            var weeklySchedule = new Dictionary<string, List<TimetableSlotDto>>();

            foreach (var day in days)
            {
                var dayTimetables = timetables
                    .Where(t => t.Day.ToString() == day)
                    .Select(t => new TimetableSlotDto
                    {
                        Time = $"{t.StartTime:hh\\:mm}-{t.EndTime:hh\\:mm}",
                        SubjectName = t.Subject.Name,
                        TeacherName = t.Teacher.FullName,
                        Room = t.Room,
                        ClassName = classEntity.Name
                    }).ToList();

                weeklySchedule[day] = dayTimetables;
            }

            return new TimetableByClassDto
            {
                ClassOid = classEntity.Oid,
                ClassName = classEntity.Name,
                WeeklySchedule = weeklySchedule
            };
        }
    }

}
