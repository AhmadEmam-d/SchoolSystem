using MediatR;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class AddMaterialCommand : IRequest<Guid>
    {
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public string EntityType { get; set; }

        // Only one will be set
        public Guid? LessonOid { get; set; }
        public Guid? ExamOid { get; set; }
        public Guid? HomeworkOid { get; set; }
    }
}