using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetTeacherActivityLog
{
    public class GetTeacherActivityLogQueryHandler : IRequestHandler<GetTeacherActivityLogQuery, List<TeacherActivityLogDto>>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IMapper _mapper;

        public GetTeacherActivityLogQueryHandler(IGenericRepository<User> userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<List<TeacherActivityLogDto>> Handle(GetTeacherActivityLogQuery request, CancellationToken cancellationToken)
        {
            var query = _userRepo.GetAllQueryable()
                .Where(u => u.Role == UserRole.Teacher);

            if (request.TeacherOid.HasValue)
                query = query.Where(u => u.Oid == request.TeacherOid.Value);

            var teachers = await query.ToListAsync(cancellationToken);

            var result = new List<TeacherActivityLogDto>();
            foreach (var teacher in teachers)
            {
                result.Add(new TeacherActivityLogDto
                {
                    TeacherOid = teacher.Oid,
                    TeacherName = teacher.FullName,
                    LastLogin = teacher.LastLoginAt ?? DateTime.UtcNow,
                    TotalLogins = 0,
                    RecentActivities = new List<ActivityDto>()
                });
            }

            return result;
        }
    }
}