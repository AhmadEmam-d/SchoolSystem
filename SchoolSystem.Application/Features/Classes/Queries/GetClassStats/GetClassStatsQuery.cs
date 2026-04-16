using MediatR;

namespace SchoolSystem.Application.Features.Classes.Queries.GetClassStats
{
    public class GetClassStatsQuery : IRequest<ClassStatsDto>
    {
        public Guid ClassId { get; set; }

        public GetClassStatsQuery(Guid classId)
        {
            ClassId = classId;
        }
    }

    public class ClassStatsDto
    {
        public int TotalStudents { get; set; }
        public double AverageAttendance { get; set; }
        public double AverageGrade { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public int UpcomingExams { get; set; }
        public int PendingAssignments { get; set; }
    }
}