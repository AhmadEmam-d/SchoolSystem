// Application/Features/Lessons/DTOs/CreateLessonDto.cs
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Lessons.DTOs.Create
{
    public class CreateLessonDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid ClassOid { get; set; }
        public Guid SubjectOid { get; set; }
        public LessonType Type { get; set; }
        public List<string> Objectives { get; set; } = new List<string>();
        public List<CreateMaterialDto> Materials { get; set; } = new List<CreateMaterialDto>();
        public List<string> ResourceLinks { get; set; } = new List<string>();
        public CreateHomeworkDto? Homework { get; set; }
        public string TeacherNotes { get; set; }
    }

    public class CreateMaterialDto
    {
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
    }

    public class CreateHomeworkDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }
}