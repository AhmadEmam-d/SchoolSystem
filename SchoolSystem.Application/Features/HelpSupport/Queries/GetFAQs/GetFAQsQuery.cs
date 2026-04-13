// Application/Features/HelpSupport/Queries/GetFAQs/GetFAQsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.HelpSupport.DTOs;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetFAQs
{
    public class GetFAQsQuery : IRequest<List<FAQDto>>
    {
        public string? Category { get; set; }
        public string? SearchTerm { get; set; }
    }
}