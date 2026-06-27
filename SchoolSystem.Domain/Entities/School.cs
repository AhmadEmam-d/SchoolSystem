using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class School : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
        public ICollection<Class> Classes { get; set; } = new List<Class>();
        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
        public ICollection<Parent> Parents { get; set; } = new List<Parent>();
        public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
        public ICollection<Exam> Exams { get; set; } = new List<Exam>();
    }
}