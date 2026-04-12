// Application/Features/HelpSupport/Queries/GetKnowledgeBase/GetKnowledgeBaseQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetKnowledgeBase
{
    public class GetKnowledgeBaseQueryHandler : IRequestHandler<GetKnowledgeBaseQuery, List<KnowledgeBaseDto>>
    {
        private readonly IGenericRepository<KnowledgeBaseArticle> _articleRepo;
        private readonly IMapper _mapper;

        public GetKnowledgeBaseQueryHandler(IGenericRepository<KnowledgeBaseArticle> articleRepo, IMapper mapper)
        {
            _articleRepo = articleRepo;
            _mapper = mapper;
        }

        public async Task<List<KnowledgeBaseDto>> Handle(GetKnowledgeBaseQuery request, CancellationToken cancellationToken)
        {
            var query = _articleRepo.GetAllQueryable()
                .Where(a => a.IsPublished && !a.IsDeleted);

            if (!string.IsNullOrEmpty(request.Category))
                query = query.Where(a => a.Category == request.Category);

            var articles = await query
                .OrderBy(a => a.Category)
                .ThenBy(a => a.Title)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<KnowledgeBaseDto>>(articles);
        }
    }
}