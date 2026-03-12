using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Notifications.Dtos.Create
{
    public class CreateNotificationDto
    {
        public Guid UserOid { get; set; }
        public string Message { get; set; }
    }
}
