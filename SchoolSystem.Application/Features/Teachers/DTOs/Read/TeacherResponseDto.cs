using SchoolSystem.Application.Features.Subjects.DTOs;

namespace SchoolSystem.Application.Features.Teachers.DTOs
{
    public class TeacherResponseDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public List<SubjectBasicDto> Subjects { get; set; } = new List<SubjectBasicDto>();
        public class SubjectBasicDto
        {
            public Guid Oid { get; set; }
            public string Name { get; set; }
        }
    }
}