// Application/Features/HelpSupport/Queries/GetArticleById/GetArticleByIdQuery.cs
using MediatR;
using SchoolSystem.Application.Features.HelpSupport.DTOs;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetArticleById
{
    public class GetArticleByIdQuery : IRequest<KnowledgeBaseDto>
    {
        public Guid Id { get; set; }

        public GetArticleByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}