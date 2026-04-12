// Application/Features/HelpSupport/Mapping/HelpSupportProfile.cs
using AutoMapper;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mapping
{
    public class HelpSupportProfile : Profile
    {
        public HelpSupportProfile()
        {
            CreateMap<FAQ, FAQDto>();
            CreateMap<KnowledgeBaseArticle, KnowledgeBaseDto>();
            CreateMap<SupportTicket, TicketResponseDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        }
    }
}