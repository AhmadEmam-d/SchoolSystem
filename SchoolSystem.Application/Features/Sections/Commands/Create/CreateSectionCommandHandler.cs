using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Sections.Commands.Create;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class CreateSectionCommandHandler
    : IRequestHandler<CreateSectionCommand, CreateSectionCommandResponse>
{
    private readonly IGenericRepository<Section> _sectionRepo;
    private readonly IGenericRepository<Class> _classRepo;
    private readonly IMapper _mapper;

    public CreateSectionCommandHandler(
        IGenericRepository<Section> sectionRepo,
        IGenericRepository<Class> classRepo,
        IMapper mapper)
    {
        _sectionRepo = sectionRepo;
        _classRepo = classRepo;
        _mapper = mapper;
    }

    public async Task<CreateSectionCommandResponse> Handle(
        CreateSectionCommand request,
        CancellationToken cancellationToken)
    {
        var classEntity = await _classRepo.GetByOidAsync(request.Section.ClassOid);
        if (classEntity == null)
        {
            throw new Exception($"Class with Oid {request.Section.ClassOid} not found");
        }

        var entity = _mapper.Map<Section>(request.Section);
        entity.Oid = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;
        entity.SchoolId = classEntity.SchoolId; 

        await _sectionRepo.CreateAsync(entity);

        return new CreateSectionCommandResponse
        {
            Oid = entity.Oid
        };
    }
}