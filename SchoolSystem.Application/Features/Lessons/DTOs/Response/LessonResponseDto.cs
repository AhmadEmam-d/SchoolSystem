// Application/Features/Lessons/DTOs/LessonResponseDto.cs
namespace SchoolSystem.Application.Features.Lessons.DTOs
{
    public class LessonResponseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public string ClassName { get; set; }
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public int MaterialsCount { get; set; }
        public int ObjectivesCount { get; set; }
        public bool HasHomework { get; set; }
        public List<ObjectiveResponseDto> Objectives { get; set; }
        public List<MaterialResponseDto> Materials { get; set; }
        public List<string> ResourceLinks { get; set; }
        public HomeworkResponseDto? Homework { get; set; }
        public string TeacherNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ObjectiveResponseDto
    {
        public Guid Oid { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
    }

    public class MaterialResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
    }

    public class HomeworkResponseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class LessonStatsDto
    {
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public int UpcomingLessons { get; set; }
        public int TotalMaterials { get; set; }
        public int ThisWeekLessons { get; set; }
        public int ThisMonthLessons { get; set; }
    }
}