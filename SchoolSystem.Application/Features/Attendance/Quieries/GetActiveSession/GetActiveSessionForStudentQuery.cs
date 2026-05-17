using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Attendance.Quieries.GetActiveSession
{
    public class GetActiveSessionForStudentQuery : IRequest<ActiveSessionDto>
    {
        public Guid StudentId { get; set; }
    }

    public class ActiveSessionDto
    {
        public Guid SessionId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public AttendanceMethod Method { get; set; }
        public string? QrCodeBase64 { get; set; }      
        public List<int>? RandomNumbers { get; set; } 
        public DateTime ExpiresAt { get; set; }
    }
}
