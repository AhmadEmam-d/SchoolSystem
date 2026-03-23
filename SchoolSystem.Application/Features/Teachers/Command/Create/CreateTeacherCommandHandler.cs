using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Teachers.Commands.Create
{
    public class CreateTeacherCommandHandler
        : IRequestHandler<CreateTeacherCommand, CreateTeacherCommandResponse>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public CreateTeacherCommandHandler(
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<CreateTeacherCommandResponse> Handle(
            CreateTeacherCommand request,
            CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Teacher>(request.Teacher);

            await _teacherRepo.AddAsync(entity);

            return new CreateTeacherCommandResponse
            {
                Oid = entity.Oid
            };
        }
    }
}