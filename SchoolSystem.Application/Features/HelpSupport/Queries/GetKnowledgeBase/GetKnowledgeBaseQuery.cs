// Application/Features/HelpSupport/Queries/GetKnowledgeBase/GetKnowledgeBaseQuery.cs
using MediatR;
using SchoolSystem.Application.Features.HelpSupport.DTOs;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetKnowledgeBase
{
    public class GetKnowledgeBaseQuery : IRequest<List<KnowledgeBaseDto>>
    {
        public string? Category { get; set; }
    }
}