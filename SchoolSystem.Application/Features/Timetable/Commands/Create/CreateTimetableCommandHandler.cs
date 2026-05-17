using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Commands.Create
{
    public class CreateTimetableCommandHandler : IRequestHandler<CreateTimetableCommand, Guid>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public CreateTimetableCommandHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Timetable> timetableRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Subject> subjectRepo,
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _timetableRepo = timetableRepo;
            _classRepo = classRepo;
            _subjectRepo = subjectRepo;
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTimetableCommand request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception($"Class with ID {request.Dto.ClassOid} not found");

            var subject = await _subjectRepo.GetByOidAsync(request.Dto.SubjectOid);
            if (subject == null)
                throw new Exception($"Subject with ID {request.Dto.SubjectOid} not found");

            var teacher = await _teacherRepo.GetByOidAsync(request.Dto.TeacherOid);
            if (teacher == null)
                throw new Exception($"Teacher with ID {request.Dto.TeacherOid} not found");

            var day = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), request.Dto.Day);
            var startTime = TimeSpan.Parse(request.Dto.StartTime);
            var endTime = TimeSpan.Parse(request.Dto.EndTime);

            if (day == DayOfWeek.Friday || day == DayOfWeek.Saturday)
                throw new Exception("Lessons cannot be scheduled on Friday or Saturday.");

            var existing = await _timetableRepo.GetAllQueryable()
                .AnyAsync(t => t.TeacherOid == request.Dto.TeacherOid
                    && t.Day == day
                    && ((t.StartTime <= startTime && t.EndTime > startTime)
                        || (t.StartTime < endTime && t.EndTime >= endTime)
                        || (t.StartTime >= startTime && t.EndTime <= endTime)),
                    cancellationToken);

            if (existing)
                throw new Exception("Teacher has a scheduling conflict at this time");

            var timetable = _mapper.Map<SchoolSystem.Domain.Entities.Timetable>(request.Dto);
            timetable.Day = day;
            timetable.StartTime = startTime;
            timetable.EndTime = endTime;

            await _timetableRepo.AddAsync(timetable);
            return timetable.Oid;
        }
    }
}