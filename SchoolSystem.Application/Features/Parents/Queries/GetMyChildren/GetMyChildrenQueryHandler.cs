// Application/Features/Parents/Queries/GetMyChildren/GetMyChildrenQueryHandler.cs
using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using MediatR;

namespace SchoolSystem.Application.Features.Parents.Queries.GetMyChildren
{
    public class GetMyChildrenQueryHandler : IRequestHandler<GetMyChildrenQuery, MyChildrenDto>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IMediator _mediator;  // ✅ To call grades API

        public GetMyChildrenQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _attendanceRepo = attendanceRepo;
            _mediator = mediator;
        }

        public async Task<MyChildrenDto> Handle(GetMyChildrenQuery request, CancellationToken cancellationToken)
        {
            // Get parent by UserId
            var allParents = await _parentRepo.GetAllAsync();
            var parent = allParents.FirstOrDefault(p => p.UserId == request.ParentUserId);

            if (parent == null)
                throw new Exception("Parent not found");

            // Get all students for this parent
            var allStudents = await _studentRepo.GetAllAsync();
            var students = allStudents.Where(s => s.ParentOid == parent.Oid).ToList();

            // Get all classes
            var allClasses = await _classRepo.GetAllAsync();

            // Get all attendances
            var allAttendances = await _attendanceRepo.GetAllAsync();

            var childrenList = new List<ChildDetailsDto>();

            foreach (var student in students)
            {
                // Get student's class
                var studentClass = allClasses.FirstOrDefault(c => c.Oid == student.ClassOid);

                // ✅ Get student grades using your existing grades query
                var gradesQuery = new GetStudentGradesQuery(student.Oid);
                var gradesData = await _mediator.Send(gradesQuery, cancellationToken);

                // Calculate GPA from grades data
                double gpa = 0;
                if (gradesData?.OverallGPA != null)
                {
                    gpa = gradesData.OverallGPA.GPA;
                }

                // Get subjects count from subject performance
                int subjectsCount = gradesData?.SubjectPerformance?.Subjects?.Count ?? 0;
                if (subjectsCount == 0) subjectsCount = 0; // Default fallback

                // Calculate attendance percentage
                var studentAttendances = allAttendances.Where(a => a.StudentOid == student.Oid).ToList();
                var presentCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Present);
                var attendancePercentage = studentAttendances.Any()
                    ? (double)presentCount / studentAttendances.Count * 100
                    : 0; // Default fallback

                // Get grade level from class
                var gradeLevel = GetGradeLevelFromClass(studentClass);

                childrenList.Add(new ChildDetailsDto
                {
                    ChildId = student.Oid,
                    Name = student.FullName ?? $"{student.FullName}",
                    GradeLevel = gradeLevel,
                    GPA = Math.Round(gpa, 1),
                    Attendance = Math.Round(attendancePercentage, 0),
                    SubjectsCount = subjectsCount
                });
            }

            return new MyChildrenDto
            {
                Children = childrenList
            };
        }

        private string GetGradeLevelFromClass(Class studentClass)
        {
            if (studentClass == null) return "N/A";

            // Try to extract grade number from class name
            if (!string.IsNullOrEmpty(studentClass.Name))
            {
                // Look for patterns like "Grade 10", "Class 5", "10th"
                var words = studentClass.Name.Split(' ', '-', '_');
                foreach (var word in words)
                {
                    // Check for "10th" pattern
                    if (word.Contains("th") && int.TryParse(word.Replace("th", ""), out int grade))
                    {
                        return $"{grade}{GetOrdinal(grade)}";
                    }

                    // Check for plain number
                    if (int.TryParse(word, out int gradeNum) && gradeNum >= 1 && gradeNum <= 12)
                    {
                        return $"{gradeNum}{GetOrdinal(gradeNum)}";
                    }
                }
            }

            return studentClass.Name ?? "N/A";
        }

        private string GetOrdinal(int number)
        {
            return (number % 100) switch
            {
                11 or 12 or 13 => "th",
                _ => (number % 10) switch
                {
                    1 => "st",
                    2 => "nd",
                    3 => "rd",
                    _ => "th"
                }
            };
        }
    }
}