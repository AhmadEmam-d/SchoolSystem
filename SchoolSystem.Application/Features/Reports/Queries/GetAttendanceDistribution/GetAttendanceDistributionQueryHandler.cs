using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetAttendanceDistribution
{
    public class GetAttendanceDistributionQueryHandler : IRequestHandler<GetAttendanceDistributionQuery, AttendanceDistributionDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IMapper _mapper;

        public GetAttendanceDistributionQueryHandler(IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo, IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _mapper = mapper;
        }

        public async Task<AttendanceDistributionDto> Handle(GetAttendanceDistributionQuery request, CancellationToken cancellationToken)
        {
            var query = _attendanceRepo.GetAllQueryable();

            if (request.ClassOid.HasValue)
                query = query.Where(a => a.ClassOid == request.ClassOid.Value);

            if (request.FromDate.HasValue)
                query = query.Where(a => a.Date >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(a => a.Date <= request.ToDate.Value);

            var attendances = await query.ToListAsync(cancellationToken);

            var present = attendances.Count(a => a.Status == AttendanceStatus.Present);
            var absent = attendances.Count(a => a.Status == AttendanceStatus.Absent);
            var late = attendances.Count(a => a.Status == AttendanceStatus.Late);
            var total = attendances.Count;

            return new AttendanceDistributionDto
            {
                Present = present,
                Absent = absent,
                Late = late,
                PresentPercentage = total > 0 ? Math.Round((double)present / total * 100, 1) : 0,
                AbsentPercentage = total > 0 ? Math.Round((double)absent / total * 100, 1) : 0,
                LatePercentage = total > 0 ? Math.Round((double)late / total * 100, 1) : 0
            };
        }
    }
}