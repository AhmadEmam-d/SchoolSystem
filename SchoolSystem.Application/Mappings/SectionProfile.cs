using AutoMapper;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Create;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;

public class SectionProfile : Profile
{
    public SectionProfile()
    {
        CreateMap<Section, SectionDto>()
                .ForMember(dest => dest.Class, opt => opt.MapFrom(src => src.Class))
                .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

        CreateMap<Class, ClassBasicDto>();

        CreateMap<Student, StudentBasicDto>();
    }
}