using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetTimeTableByTeacher
{
    public class GetTimetableByTeacherQueryHandler : IRequestHandler<GetTimetableByTeacherQuery, TimetableByTeacherDto>
    {
        private readonly IGenericRepository<Domain.Entities.Timetable> _timetableRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public GetTimetableByTeacherQueryHandler(
            IGenericRepository<Domain.Entities.Timetable> timetableRepo,
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _timetableRepo = timetableRepo;
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<TimetableByTeacherDto> Handle(GetTimetableByTeacherQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo.GetByOidAsync(request.TeacherOid);
            if (teacher == null)
                throw new Exception($"Teacher with ID {request.TeacherOid} not found");

            var timetables = await _timetableRepo.GetAllQueryable()
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Where(t => t.TeacherOid == request.TeacherOid)
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
                        TeacherName = teacher.FullName,
                        Room = t.Room,
                        ClassName = t.Class?.Name ?? "N/A",
                        // أضف هذه الخصائص
                        ClassOid = t.ClassOid,
                        SubjectOid = t.SubjectOid,
                        Day = t.Day.ToString(),
                        StartTime = t.StartTime.ToString(@"hh\:mm"),
                        EndTime = t.EndTime.ToString(@"hh\:mm"),
                        Period = t.Period
                    }).ToList();

                weeklySchedule[day] = dayTimetables;
            }

            return new TimetableByTeacherDto
            {
                TeacherOid = teacher.Oid,
                TeacherName = teacher.FullName,
                WeeklySchedule = weeklySchedule,
            };
        }
    }
}