// Application/Features/Materials/Commands/DeleteMaterialCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteMaterialCommand : IRequest<bool>
    {
        // Option 1: Delete by specific material OID
        public Guid? MaterialOid { get; set; }

        // Option 2: Delete by entity and file URL (for the current delete endpoint)
        public Guid? ExamOid { get; set; }
        public Guid? LessonOid { get; set; }
        public Guid? HomeworkOid { get; set; }
        public string? FileUrl { get; set; }

        // Option 3: Delete all materials for an entity
        public bool DeleteAllForEntity { get; set; }
    }
}