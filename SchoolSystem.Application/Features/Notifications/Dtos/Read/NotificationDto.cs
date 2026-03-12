using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Notifications.Dtos.Read
{
    public class NotificationDto
    {
        public Guid Oid { get; set; }
        public Guid UserOid { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
