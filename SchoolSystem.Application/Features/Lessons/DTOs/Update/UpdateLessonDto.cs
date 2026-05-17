// Application/Features/Lessons/DTOs/UpdateLessonDto.cs
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Lessons.DTOs
{
    public class UpdateLessonDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; }= string.Empty;
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }
        public LessonType Type { get; set; }
        public LessonStatus Status { get; set; }
        public List<UpdateObjectiveDto> Objectives { get; set; } = new List<UpdateObjectiveDto>();
        public List<UpdateMaterialDto> Materials { get; set; } = new List<UpdateMaterialDto>();
        public List<string> ResourceLinks { get; set; } = new List<string>();
        public UpdateLessonHomeworkDto? Homework { get; set; }
        public string? TeacherNotes { get; set; }
    }

    public class UpdateObjectiveDto
    {
        public Guid? Oid { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class UpdateMaterialDto
    {
        public Guid? Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; }= string.Empty;
        public string FileType { get; set; }= string.Empty;
        public long FileSize { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class UpdateLessonHomeworkDto
    {
        public Guid? Oid { get; set; }
        public string Title { get; set; }=string.Empty;
        public string Description { get; set; }= string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}