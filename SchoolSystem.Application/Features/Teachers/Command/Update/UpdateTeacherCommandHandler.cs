using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Teachers.Commands.Update;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Teachers.Commands.Update
{
    public class UpdateTeacherCommandHandler : IRequestHandler<UpdateTeacherCommand, UpdateTeacherCommandResponse>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<TeacherSubject> _teacherSubjectRepo;
        private readonly IMapper _mapper;

        public UpdateTeacherCommandHandler(
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<TeacherSubject> teacherSubjectRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _teacherSubjectRepo = teacherSubjectRepo;
            _mapper = mapper;
        }

        public async Task<UpdateTeacherCommandResponse> Handle(UpdateTeacherCommand request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo.GetByOidAsync(request.Oid);
            if (teacher == null)
                throw new Exception($"Teacher with Oid {request.Oid} not found.");

            // Map basic fields
            _mapper.Map(request.Teacher, teacher);

            // Update TeacherSubjects
            teacher.TeacherSubjects.Clear();
            if (request.Teacher.SubjectOids != null)
            {
                foreach (var subjectId in request.Teacher.SubjectOids)
                {
                    teacher.TeacherSubjects.Add(new TeacherSubject
                    {
                        TeacherOid = teacher.Oid,
                        SubjectOid = subjectId
                    });
                }
            }

            await _teacherRepo.UpdateAsync(teacher);

            return new UpdateTeacherCommandResponse
            {
                Oid = teacher.Oid
            };
        }
    }
}