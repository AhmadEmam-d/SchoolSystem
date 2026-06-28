using AutoMapper;
using SchoolSystem.Application.Features.Classes.DTOs.Create;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Application.Features.Classes.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class ClassMappingProfile : Profile
{
    public ClassMappingProfile()
    {
        CreateMap<CreateClassDto, Class>();
        CreateMap<UpdateClassDto, Class>();

      
        CreateMap<Student, StudentBasicInfoDto>()
            .ForMember(dest => dest.Oid, opt => opt.MapFrom(src => src.Oid))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email ?? string.Empty))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone ?? string.Empty))
            .ForMember(dest => dest.Details, opt => opt.Ignore());

        CreateMap<Student, StudentNameDto>()
            .ForMember(dest => dest.Oid, opt => opt.MapFrom(src => src.Oid))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

        CreateMap<Class, ClassResponseDto>()
            .ForMember(dest => dest.StudentsCount,
                opt => opt.MapFrom(src => src.Students != null ? src.Students.Count(s => !s.IsDeleted) : 0))
            .ForMember(dest => dest.SectionsCount,
                opt => opt.MapFrom(src => src.Sections != null ? src.Sections.Count(s => !s.IsDeleted) : 0))
            .ForMember(dest => dest.Students,
                opt => opt.MapFrom(src => src.Students.Where(s => !s.IsDeleted)))
            .ForMember(dest => dest.Studentsnames,
                opt => opt.MapFrom(src => src.Students.Where(s => !s.IsDeleted))); 
    }
}