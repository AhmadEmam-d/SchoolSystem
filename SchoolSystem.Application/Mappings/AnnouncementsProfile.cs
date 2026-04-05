using AutoMapper;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Entities;
using System;

namespace SchoolSystem.Application.Mappings
{
    public class AnnouncementsProfile : Profile
    {
        public AnnouncementsProfile()
        {
            CreateMap<Announcement, AnnouncementDto>()
                .ForMember(dest => dest.Target, opt => opt.MapFrom(src => src.Target.ToString()))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
                .ForMember(dest => dest.TimeAgo, opt => opt.MapFrom(src => GetTimeAgo(src.PublishDate)));

            CreateMap<CreateAnnouncementDto, Announcement>();
            CreateMap<UpdateAnnouncementDto, Announcement>();
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