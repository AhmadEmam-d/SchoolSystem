// Application/Features/Homeworks/Queries/GetGradeReport/GetHomeworkGradeReportQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetGradeReport
{
    public class GetHomeworkGradeReportQuery : IRequest<HomeworkGradeReportDto>
    {
        public Guid HomeworkId { get; set; }

        public GetHomeworkGradeReportQuery(Guid homeworkId)
        {
            HomeworkId = homeworkId;
        }
    }
}