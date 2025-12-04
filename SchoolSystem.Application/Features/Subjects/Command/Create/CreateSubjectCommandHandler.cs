using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class CreateSubjectCommandHandler : IRequestHandler<CreateSubjectCommand, Guid>
{
    private readonly IGenericRepository<Subject> _repo;
    private readonly IMapper _mapper;

    public CreateSubjectCommandHandler(IGenericRepository<Subject> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
    {
        var subject = _mapper.Map<Subject>(request.Subject);
        subject.Oid = Guid.NewGuid();
        subject.CreatedAt = DateTime.UtcNow;

        await _repo.AddAsync(subject);
        return subject.Oid;
    }
}
