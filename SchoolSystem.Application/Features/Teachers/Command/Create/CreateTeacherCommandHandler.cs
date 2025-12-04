using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.Command.Create
{
    using AutoMapper;
    using MediatR;
    using SchoolSystem.Domain.Entities;
    using SchoolSystem.Domain.Interfaces.Common;

    public class CreateTeacherCommandHandler : IRequestHandler<CreateTeacherCommand, Guid>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IMapper _mapper;

        public CreateTeacherCommandHandler(
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Subject> subjectRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _subjectRepo = subjectRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTeacherCommand request, CancellationToken cancellationToken)
        {
            var teacher = _mapper.Map<Teacher>(request.Teacher);
            teacher.Oid = Guid.NewGuid();
            teacher.CreatedAt = DateTime.UtcNow;

            // Load Subjects
            if (request.Teacher.SubjectOids != null && request.Teacher.SubjectOids.Any())
            {
                var subjects = await _subjectRepo.GetAllAsync();
                teacher.Subjects = subjects
                    .Where(s => request.Teacher.SubjectOids.Contains(s.Oid))
                    .ToList();
            }

            await _teacherRepo.AddAsync(teacher);
            return teacher.Oid;
        }
    }

}
