// Application/Features/Materials/Commands/DeleteMaterialCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteMaterialCommand : IRequest<bool>
    {
        public Guid? MaterialOid { get; set; }

        public Guid? ExamOid { get; set; }
        public Guid? LessonOid { get; set; }
        public Guid? HomeworkOid { get; set; }
        public string? FileUrl { get; set; }

        public bool DeleteAllForEntity { get; set; }
    }
}