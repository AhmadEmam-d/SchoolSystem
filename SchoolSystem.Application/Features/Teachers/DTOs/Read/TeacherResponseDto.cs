namespace SchoolSystem.Application.Features.Teachers.DTOs
{
    public class TeacherResponseDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public List<string> Subjects { get; set; } = new();
        public object Teacher { get; set; }
    }
}