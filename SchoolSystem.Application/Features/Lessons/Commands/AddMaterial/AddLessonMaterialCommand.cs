// Application/Features/Lessons/Commands/AddMaterial/AddLessonMaterialCommand.cs
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class AddLessonMaterialCommand : IRequest<Guid>
{
    public Guid LessonOid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
}

// Application/Features/Lessons/Commands/AddMaterial/AddLessonMaterialCommandHandler.cs
public class AddLessonMaterialCommandHandler : IRequestHandler<AddLessonMaterialCommand, Guid>
{
    private readonly IGenericRepository<LessonMaterial> _materialRepo;

    public AddLessonMaterialCommandHandler(IGenericRepository<LessonMaterial> materialRepo)
    {
        _materialRepo = materialRepo;
    }

    public async Task<Guid> Handle(AddLessonMaterialCommand request, CancellationToken cancellationToken)
    {
        var material = new LessonMaterial
        {
            Oid = Guid.NewGuid(),
            LessonOid = request.LessonOid,
            Name = request.Name,
            FileUrl = request.FileUrl,
            FileType = request.FileType,
            FileSize = request.FileSize,
            CreatedAt = DateTime.UtcNow
        };

        await _materialRepo.AddAsync(material);
        return material.Oid;
    }
}