// Application/Features/HelpSupport/Queries/GetArticleById/GetArticleByIdQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetArticleById
{
    public class GetArticleByIdQueryHandler : IRequestHandler<GetArticleByIdQuery, KnowledgeBaseDto>
    {
        private readonly IGenericRepository<KnowledgeBaseArticle> _articleRepo;
        private readonly IMapper _mapper;

        public GetArticleByIdQueryHandler(IGenericRepository<KnowledgeBaseArticle> articleRepo, IMapper mapper)
        {
            _articleRepo = articleRepo;
            _mapper = mapper;
        }

        public async Task<KnowledgeBaseDto> Handle(GetArticleByIdQuery request, CancellationToken cancellationToken)
        {
            var article = await _articleRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(a => a.Oid == request.Id && a.IsPublished && !a.IsDeleted, cancellationToken);

            if (article == null)
                throw new Exception("Article not found");

            // Increment view count
            article.ViewCount++;
            await _articleRepo.UpdateAsync(article);

            return _mapper.Map<KnowledgeBaseDto>(article);
        }
    }
}