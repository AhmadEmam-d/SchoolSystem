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
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.TimeAgo, opt => opt.MapFrom(src => GetTimeAgo(src.SentAt)))
                .ForMember(dest => dest.Replies, opt => opt.Ignore())
                // ✅ Add these missing mappings
                .ForMember(dest => dest.ReceiverName, opt => opt.MapFrom(src => src.ReceiverName ?? "Unknown"))
                .ForMember(dest => dest.ReceiverRole, opt => opt.MapFrom(src => src.ReceiverRole ?? "N/A"))
                .ForMember(dest => dest.ReceiverOid, opt => opt.MapFrom(src => src.ReceiverOid))
                .ForMember(dest => dest.SenderName, opt => opt.MapFrom(src => src.SenderName ?? "Unknown"))
                .ForMember(dest => dest.SenderRole, opt => opt.MapFrom(src => src.SenderRole ?? "N/A"));

            CreateMap<CreateMessageDto, Message>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.SentAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsRead, opt => opt.Ignore())
                .ForMember(dest => dest.ReadAt, opt => opt.Ignore())
                .ForMember(dest => dest.SenderOid, opt => opt.Ignore())
                .ForMember(dest => dest.SenderName, opt => opt.Ignore())
                .ForMember(dest => dest.SenderRole, opt => opt.Ignore())
                .ForMember(dest => dest.ReceiverName, opt => opt.Ignore())
                .ForMember(dest => dest.ReceiverRole, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeletedBySender, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeletedByReceiver, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.IsGroupMessage, opt => opt.MapFrom(src => src.IsGroupMessage))
                .ForMember(dest => dest.TargetRole, opt => opt.MapFrom(src => src.TargetRole))
                .ForMember(dest => dest.ParentMessageOid, opt => opt.MapFrom(src => src.ParentMessageOid));
        }

        private static string GetTimeAgo(DateTime dateTime)
        {
            var span = DateTime.UtcNow - dateTime;

            if (span.TotalSeconds < 60)
                return "Just now";
            if (span.TotalMinutes < 1)
                return "Just now";
            if (span.TotalMinutes < 60)
                return $"{(int)span.TotalMinutes} minute{(span.TotalMinutes >= 2 ? "s" : "")} ago";
            if (span.TotalHours < 24)
                return $"{(int)span.TotalHours} hour{(span.TotalHours >= 2 ? "s" : "")} ago";
            if (span.TotalDays < 7)
                return $"{(int)span.TotalDays} day{(span.TotalDays >= 2 ? "s" : "")} ago";
            if (span.TotalDays < 30)
                return $"{(int)(span.TotalDays / 7)} week{(span.TotalDays / 7 >= 2 ? "s" : "")} ago";

            return dateTime.ToString("MMM dd, yyyy");
        }
    }
}