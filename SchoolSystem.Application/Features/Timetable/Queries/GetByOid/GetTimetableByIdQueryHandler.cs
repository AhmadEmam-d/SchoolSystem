using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Queries.GetById
{
    public class GetTimetableByOidQueryHandler : IRequestHandler<GetTimetableByOidQuery, TimetableDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;
        private readonly IMapper _mapper;

        public GetTimetableByOidQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Timetable> timetableRepo,
            IMapper mapper)
        {
            _timetableRepo = timetableRepo;
            _mapper = mapper;
        }

        public async Task<TimetableDto> Handle(GetTimetableByOidQuery request, CancellationToken cancellationToken)
        {
            return await _timetableRepo.GetAllQueryable()
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.Oid == request.Oid)
                .ProjectTo<TimetableDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}