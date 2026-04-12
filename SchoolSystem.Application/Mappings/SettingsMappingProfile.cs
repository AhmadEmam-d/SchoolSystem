using AutoMapper;  
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class SettingsMappingProfile : Profile
    {
        public SettingsMappingProfile()
        {
            CreateMap<Setting, SettingsDto>().ReverseMap();
            CreateMap<SystemBackup, SystemBackupDto>().ReverseMap();
            CreateMap<UserPreference, UserPreferenceDto>()
                .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.PreferenceKey))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.PreferenceValue))
                .ReverseMap()
                .ForMember(dest => dest.PreferenceKey, opt => opt.MapFrom(src => src.Key))
                .ForMember(dest => dest.PreferenceValue, opt => opt.MapFrom(src => src.Value));
        }
    }
}