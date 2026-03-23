using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Commands.Create
{
    public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, CreateStudentCommandResponse>
    {
        private readonly IGenericRepository<Student> _repository;
        private readonly IMapper _mapper;

        public CreateStudentCommandHandler(IGenericRepository<Student> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CreateStudentCommandResponse> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {
            var student = _mapper.Map<Student>(request.Student);
            student.Oid = Guid.NewGuid();
            student.CreatedAt = DateTime.UtcNow;

            await _repository.CreateAsync(student);

            return new CreateStudentCommandResponse
            {
                Oid = student.Oid
            };
        }
    }
}