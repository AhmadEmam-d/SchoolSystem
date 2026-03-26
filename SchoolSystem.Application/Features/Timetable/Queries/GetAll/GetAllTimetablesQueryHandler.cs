using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetAll
{
    public class GetAllTimetablesQueryHandler : IRequestHandler<GetAllTimetablesQuery, List<TimetableDto>>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;
        private readonly IMapper _mapper;

        public GetAllTimetablesQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Timetable> timetableRepo,
            IMapper mapper)
        {
            _timetableRepo = timetableRepo;
            _mapper = mapper;
        }

        public async Task<List<TimetableDto>> Handle(GetAllTimetablesQuery request, CancellationToken cancellationToken)
        {
            return await _timetableRepo.GetAllQueryable()
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .ProjectTo<TimetableDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}