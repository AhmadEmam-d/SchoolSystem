using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Commands.Update
{
    public class UpdateStudentCommandHandler
        : IRequestHandler<UpdateStudentCommand, UpdateStudentCommandResponse>
    {
        private readonly IGenericRepository<Student> _repo;
        private readonly IMapper _mapper;

        public UpdateStudentCommandHandler(IGenericRepository<Student> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<UpdateStudentCommandResponse> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Oid);
            if (entity == null)
                throw new Exception($"Student with Oid {request.Oid} not found.");

            _mapper.Map(request.Student, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(entity);

            return new UpdateStudentCommandResponse
            {
                Oid = entity.Oid
            };
        }
    }
}