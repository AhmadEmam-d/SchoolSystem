// Application/Features/HelpSupport/Queries/GetFAQs/GetFAQsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetFAQs
{
    public class GetFAQsQueryHandler : IRequestHandler<GetFAQsQuery, List<FAQDto>>
    {
        private readonly IGenericRepository<FAQ> _faqRepo;
        private readonly IMapper _mapper;

        public GetFAQsQueryHandler(IGenericRepository<FAQ> faqRepo, IMapper mapper)
        {
            _faqRepo = faqRepo;
            _mapper = mapper;
        }

        public async Task<List<FAQDto>> Handle(GetFAQsQuery request, CancellationToken cancellationToken)
        {
            var query = _faqRepo.GetAllQueryable()
                .Where(f => f.IsPublished && !f.IsDeleted);

            if (!string.IsNullOrEmpty(request.Category))
                query = query.Where(f => f.Category == request.Category);

            if (!string.IsNullOrEmpty(request.SearchTerm))
                query = query.Where(f => f.Question.Contains(request.SearchTerm) ||
                                         f.Answer.Contains(request.SearchTerm));

            var faqs = await query
                .OrderBy(f => f.Order)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<FAQDto>>(faqs);
        }
    }
}