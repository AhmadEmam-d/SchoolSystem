using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, Guid>
{
    private readonly IGenericRepository<Student> _repository;
    private readonly IMapper _mapper;

    public CreateStudentCommandHandler(IGenericRepository<Student> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = _mapper.Map<Student>(request.Student);
        student.Oid = Guid.NewGuid();
        student.CreatedAt = DateTime.UtcNow;

        await _repository.CreateAsync(student);

        return student.Oid;
    }
}
