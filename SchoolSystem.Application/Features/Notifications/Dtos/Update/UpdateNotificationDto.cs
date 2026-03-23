using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Notifications.Dtos.Update
{
    public class UpdateNotificationDto
    {
        public Guid Oid { get; set; }
        public bool IsRead { get; set; }
    }
}
