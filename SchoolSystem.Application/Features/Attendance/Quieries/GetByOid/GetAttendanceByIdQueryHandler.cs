using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetById
{
    public class GetAttendanceByIdQueryHandler : IRequestHandler<GetAttendanceByIdQuery, AttendanceDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IMapper _mapper;

        public GetAttendanceByIdQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _mapper = mapper;
        }

        public async Task<AttendanceDto> Handle(GetAttendanceByIdQuery request, CancellationToken cancellationToken)
        {
            return await _attendanceRepo.GetAllQueryable()
                .Include(a => a.Student)
                .Include(a => a.Class)
                .Where(a => a.Oid == request.Oid)
                .ProjectTo<AttendanceDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}