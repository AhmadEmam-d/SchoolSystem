// Application/Features/Homeworks/Queries/GetSubmissions/GetHomeworkSubmissionsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetSubmissions
{
    public class GetHomeworkSubmissionsQuery : IRequest<List<HomeworkSubmissionResponseDto>>
    {
        public Guid HomeworkId { get; set; }

        public GetHomeworkSubmissionsQuery(Guid homeworkId)
        {
            HomeworkId = homeworkId;
        }
    }
}