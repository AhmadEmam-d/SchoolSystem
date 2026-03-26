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
            // Check if class exists
            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception($"Class with ID {request.Dto.ClassOid} not found");

            // Check if subject exists
            var subject = await _subjectRepo.GetByOidAsync(request.Dto.SubjectOid);
            if (subject == null)
                throw new Exception($"Subject with ID {request.Dto.SubjectOid} not found");

            // Check if teacher exists
            var teacher = await _teacherRepo.GetByOidAsync(request.Dto.TeacherOid);
            if (teacher == null)
                throw new Exception($"Teacher with ID {request.Dto.TeacherOid} not found");

            // Check for conflicts (same teacher at same time)
            var existing = await _timetableRepo.GetAllQueryable()
                .AnyAsync(t => t.TeacherOid == request.Dto.TeacherOid
                    && t.Day.ToString() == request.Dto.Day
                    && ((t.StartTime <= TimeSpan.Parse(request.Dto.StartTime) && t.EndTime > TimeSpan.Parse(request.Dto.StartTime))
                        || (t.StartTime < TimeSpan.Parse(request.Dto.EndTime) && t.EndTime >= TimeSpan.Parse(request.Dto.EndTime))
                        || (t.StartTime >= TimeSpan.Parse(request.Dto.StartTime) && t.EndTime <= TimeSpan.Parse(request.Dto.EndTime))),
                    cancellationToken);

            if (existing)
                throw new Exception("Teacher has a scheduling conflict at this time");

            // Map DTO to Entity
            var timetable = _mapper.Map<SchoolSystem.Domain.Entities.Timetable>(request.Dto);

            // Convert string day to enum
            timetable.Day = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), request.Dto.Day);
            timetable.StartTime = TimeSpan.Parse(request.Dto.StartTime);
            timetable.EndTime = TimeSpan.Parse(request.Dto.EndTime);

            await _timetableRepo.AddAsync(timetable);
            return timetable.Oid;
        }
    }
}