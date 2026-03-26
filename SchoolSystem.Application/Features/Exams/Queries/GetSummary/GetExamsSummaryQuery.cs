using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;

namespace SchoolSystem.Application.Features.Exams.Queries.GetSummary
{
    public class GetExamsSummaryQuery : IRequest<ExamsSummaryDto>
    {
    }
}