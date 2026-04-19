namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    // الهيكل الرئيسي للصف
    public class TeacherClassFormatDto
    {
        public string ClassId { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public int StudentsCount { get; set; }
        public List<ClassLessonDto> Lessons { get; set; } = new List<ClassLessonDto>();
        public List<ClassExamDto> Exams { get; set; } = new List<ClassExamDto>();
        public List<ClassHomeworkDto> Homeworks { get; set; } = new List<ClassHomeworkDto>();
        public List<ClassStudentDto> Students { get; set; } = new List<ClassStudentDto>();
    }

    // الدروس في الصف
    public class ClassLessonDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

    // الامتحانات في الصف
    public class ClassExamDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

    // الواجبات في الصف
    public class ClassHomeworkDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
    }

    // الطلاب في الصف
    public class ClassStudentDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        
    }

    // حضور الطالب
    public class ClassStudentAttendanceDto
    {
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public double Percentage { get; set; }
        public List<AttendanceRecordDto> RecentRecords { get; set; } = new List<AttendanceRecordDto>();
    }

    // سجلات الحضور
    public class AttendanceRecordDto
    {
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
    }

    // واجبات الطالب
    public class ClassStudentHomeworkDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
        public decimal? Grade { get; set; }
    }

    // امتحانات الطالب
    public class ClassStudentExamDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int? Score { get; set; }
        public string Grade { get; set; }
    }

    // دروس الطالب
    public class ClassStudentLessonDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}