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
        // Create Section
        CreateMap<CreateSectionDto, Section>();

        // Update Section
        CreateMap<UpdateSectionDto, Section>();

        // Read Section - هذا المهم للتخلص من sections: [null]
        CreateMap<Section, SectionDto>()
            .ForMember(dest => dest.Class, opt => opt.MapFrom(src => src.Class))
            .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

        // ✅ أضف Mapping للـ Class عشان تتخلص من sections: [null]
        CreateMap<Class, ClassResponseDto>();

        // ✅ أضف Mapping للـ Student (اختياري)
        CreateMap<Student, StudentDto>();
    }
}