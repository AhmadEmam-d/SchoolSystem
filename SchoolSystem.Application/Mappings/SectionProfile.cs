using AutoMapper;
using SchoolSystem.Application.Features.Sections.DTOs.Create;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class SectionProfile : Profile
{
    public SectionProfile()
    {
        CreateMap<CreateSectionDto, Section>();
        CreateMap<UpdateSectionDto, Section>();
        CreateMap<Section, SectionDto>();
    }
}
