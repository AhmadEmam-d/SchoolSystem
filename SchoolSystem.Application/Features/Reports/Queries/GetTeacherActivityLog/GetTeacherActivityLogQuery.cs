using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Reports.Queries.GetTeacherActivityLog
{
    public class GetTeacherActivityLogQuery : IRequest<List<TeacherActivityLogDto>>
    {
        public Guid? TeacherOid { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}