// Application/Features/Lessons/DTOs/CreateLessonDto.cs
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Lessons.DTOs.Create
{
    public class CreateLessonDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }
        public LessonType Type { get; set; }
        public List<string> Objectives { get; set; } = new List<string>();
        public List<CreateMaterialDto> Materials { get; set; } = new List<CreateMaterialDto>();
        public List<string> ResourceLinks { get; set; } = new List<string>();
        public LessonHomeworkDto? Homework { get; set; }
        public string TeacherNotes { get; set; } = string.Empty;
    }

    public class CreateMaterialDto
    {
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
    }

    public class LessonHomeworkDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
    }
}