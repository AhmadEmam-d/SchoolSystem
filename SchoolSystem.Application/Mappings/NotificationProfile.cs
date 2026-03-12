using AutoMapper;
using SchoolSystem.Application.Features.Notifications.Dtos.Create;
using SchoolSystem.Application.Features.Notifications.Dtos.Read;
using SchoolSystem.Application.Features.Notifications.Dtos.Update;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Mappings
{
    public class NotificationProfile : Profile
    {
        public NotificationProfile()
        {
            CreateMap<Notification, NotificationDto>();
            CreateMap<CreateNotificationDto, Notification>();
            CreateMap<UpdateNotificationDto, Notification>();
        }
    }
}
