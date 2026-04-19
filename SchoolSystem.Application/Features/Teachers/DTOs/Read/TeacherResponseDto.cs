using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Subjects.DTOs;

namespace SchoolSystem.Application.Features.Teachers.DTOs
{
    public class TeacherResponseDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string? UserName { get; set; }  // ✅ جعلها قابلة للـ null
        public List<SubjectBasicDto> Subjects { get; set; } = new List<SubjectBasicDto>();

        public TeacherAcademicSummaryDto? AcademicSummary { get; set; }  // ✅ جعلها قابلة للـ null
        public List<StudentBasicDto> Students { get; set; } = new List<StudentBasicDto>();

        public class SubjectBasicDto
        {
            public Guid Oid { get; set; }
            public string Name { get; set; } = string.Empty;
        }
    }

    public class TeacherAcademicSummaryDto
    {
        public int ClassesCount { get; set; }
        public int LessonsCount { get; set; }
        public int HomeworksCount { get; set; }
        public int ExamsCount { get; set; }
        public double AttendancePercentage { get; set; }
        public List<TeacherClassBasicDto> RecentClasses { get; set; } = new List<TeacherClassBasicDto>();
        public List<LessonBasicDto> RecentLessons { get; set; } = new List<LessonBasicDto>();
        public List<HomeworkBasicDto> RecentHomeworks { get; set; } = new List<HomeworkBasicDto>();
        public List<ExamBasicDto> RecentExams { get; set; } = new List<ExamBasicDto>();
    }

    public class TeacherClassBasicDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public int StudentsCount { get; set; }
    }
    public class LessonBasicDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class HomeworkBasicDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public int SubmissionsCount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ExamBasicDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public double AverageGrade { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}