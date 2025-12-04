using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

public class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand, Unit>
{
    private readonly IGenericRepository<Student> _repository;
    private readonly IMapper _mapper;

    public UpdateStudentCommandHandler(IGenericRepository<Student> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByOidAsync(request.Id);
        if (existing == null) throw new Exception("Student not found");

        _mapper.Map(request.Student, existing);
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);

        return Unit.Value; // ✅ Must return Unit
    }
}
