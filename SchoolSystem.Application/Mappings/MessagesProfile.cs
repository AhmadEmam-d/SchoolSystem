using AutoMapper;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Domain.Entities;
using System;

namespace SchoolSystem.Application.Mappings
{
    public class MessagesProfile : Profile
    {
        public MessagesProfile()
        {
            // Entity to DTO
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.TimeAgo, opt => opt.MapFrom(src => GetTimeAgo(src.SentAt)))
                .ForMember(dest => dest.Replies, opt => opt.Ignore()); // Ignore replies for now

            // Create DTO to Entity
            CreateMap<CreateMessageDto, Message>()
                .ForMember(dest => dest.IsGroupMessage, opt => opt.MapFrom(src => src.IsGroupMessage))
                .ForMember(dest => dest.TargetRole, opt => opt.MapFrom(src => src.TargetRole))
                .ForMember(dest => dest.ParentMessageOid, opt => opt.MapFrom(src => src.ParentMessageOid));
        }

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