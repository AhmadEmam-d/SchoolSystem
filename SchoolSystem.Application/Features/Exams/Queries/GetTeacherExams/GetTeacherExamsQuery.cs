// Application/Features/Exams/Queries/GetTeacherExams/GetTeacherExamsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;

namespace SchoolSystem.Application.Features.Exams.Queries.GetTeacherExams
{
    public class GetTeacherExamsQuery : IRequest<List<ExamDto>>
    {
        public Guid TeacherId { get; set; }

        public GetTeacherExamsQuery(Guid teacherId)
        {
            TeacherId = teacherId;
        }
    }
}