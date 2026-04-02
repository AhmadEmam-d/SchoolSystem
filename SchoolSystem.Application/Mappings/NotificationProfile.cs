using AutoMapper;
using SchoolSystem.Application.Features.Notifications.DTOs;
using SchoolSystem.Domain.Entities;
using System;

namespace SchoolSystem.Application.Profiles
{
    public class NotificationsProfile : Profile
    {
        public NotificationsProfile()
        {
            CreateMap<Notification, NotificationDto>()
                .ForMember(dest => dest.TimeAgo, opt => opt.MapFrom(src => GetTimeAgo(src.SentAt)));

            CreateMap<CreateNotificationDto, Notification>()
                .ForMember(dest => dest.SentAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
        }

        // ✅ جعل الدالة static
        private static string GetTimeAgo(DateTime dateTime)
        {
            var span = DateTime.UtcNow - dateTime;

            if (span.TotalMinutes < 1)
                return "Just now";
            if (span.TotalMinutes < 60)
                return $"{(int)span.TotalMinutes} minutes ago";
            if (span.TotalHours < 24)
                return $"{(int)span.TotalHours} hours ago";
            if (span.TotalDays < 7)
                return $"{(int)span.TotalDays} days ago";
            if (span.TotalDays < 30)
                return $"{(int)(span.TotalDays / 7)} weeks ago";

            return dateTime.ToString("MMM dd, yyyy");
        }
    }
}