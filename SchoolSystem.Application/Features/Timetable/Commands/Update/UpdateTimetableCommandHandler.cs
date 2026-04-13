using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Commands.Update
{
    public class UpdateTimetableCommandHandler : IRequestHandler<UpdateTimetableCommand, bool>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public UpdateTimetableCommandHandler(
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

        public async Task<bool> Handle(UpdateTimetableCommand request, CancellationToken cancellationToken)
        {
            var timetable = await _timetableRepo.GetByOidAsync(request.Dto.Oid);
            if (timetable == null)
                throw new Exception($"Timetable with ID {request.Dto.Oid} not found");

            if (request.Dto.ClassOid.HasValue)
            {
                var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid.Value);
                if (classEntity == null)
                    throw new Exception($"Class with ID {request.Dto.ClassOid} not found");
                timetable.ClassOid = request.Dto.ClassOid.Value;
            }

            if (request.Dto.SubjectOid.HasValue)
            {
                var subject = await _subjectRepo.GetByOidAsync(request.Dto.SubjectOid.Value);
                if (subject == null)
                    throw new Exception($"Subject with ID {request.Dto.SubjectOid} not found");
                timetable.SubjectOid = request.Dto.SubjectOid.Value;
            }

            if (request.Dto.TeacherOid.HasValue)
            {
                var teacher = await _teacherRepo.GetByOidAsync(request.Dto.TeacherOid.Value);
                if (teacher == null)
                    throw new Exception($"Teacher with ID {request.Dto.TeacherOid} not found");
                timetable.TeacherOid = request.Dto.TeacherOid.Value;
            }

            if (!string.IsNullOrEmpty(request.Dto.Day))
                timetable.Day = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), request.Dto.Day);

            if (!string.IsNullOrEmpty(request.Dto.StartTime))
                timetable.StartTime = TimeSpan.Parse(request.Dto.StartTime);

            if (!string.IsNullOrEmpty(request.Dto.EndTime))
                timetable.EndTime = TimeSpan.Parse(request.Dto.EndTime);

            if (!string.IsNullOrEmpty(request.Dto.Room))
                timetable.Room = request.Dto.Room;

            if (request.Dto.Period.HasValue)
                timetable.Period = request.Dto.Period.Value;

            await _timetableRepo.UpdateAsync(timetable);
            return true;
        }
    }
}