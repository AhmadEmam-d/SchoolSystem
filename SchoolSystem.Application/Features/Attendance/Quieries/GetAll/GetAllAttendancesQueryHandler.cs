using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetAll
{
    public class GetAllAttendancesQueryHandler : IRequestHandler<GetAllAttendancesQuery, List<AttendanceDto>>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IMapper _mapper;

        public GetAllAttendancesQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _mapper = mapper;
        }

        public async Task<List<AttendanceDto>> Handle(GetAllAttendancesQuery request, CancellationToken cancellationToken)
        {
            var query = _attendanceRepo.GetAllQueryable()
                .Include(a => a.Student)
                .Include(a => a.Class)
                .AsQueryable();

            if (request.ClassOid.HasValue)
                query = query.Where(a => a.ClassOid == request.ClassOid.Value);

            if (request.Date.HasValue)
                query = query.Where(a => a.Date.Date == request.Date.Value.Date);

            return await query
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.Student.FullName)
                .ProjectTo<AttendanceDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}