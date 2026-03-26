using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Queries.GetAll
{
    public class GetExamsQueryHandler : IRequestHandler<GetExamsQuery, List<ExamDto>>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IMapper _mapper;

        public GetExamsQueryHandler(IGenericRepository<Exam> examRepo, IMapper mapper)
        {
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<List<ExamDto>> Handle(GetExamsQuery request, CancellationToken cancellationToken)
        {
            var query = _examRepo.GetAllQueryable();

            if (request.SubjectOid.HasValue)
                query = query.Where(e => e.SubjectOid == request.SubjectOid.Value);

            if (request.ClassOid.HasValue)
                query = query.Where(e => e.ClassOid == request.ClassOid.Value);

            if (request.Status.HasValue)
                query = query.Where(e => e.Status == (ExamStatus)request.Status.Value);

            if (request.Type.HasValue)
                query = query.Where(e => e.Type == (ExamType)request.Type.Value);

            return await query
                .Include(e => e.Subject)
                .Include(e => e.Class)
                .OrderByDescending(e => e.Date)
                .ProjectTo<ExamDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}