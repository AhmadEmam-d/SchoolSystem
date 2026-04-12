using AutoMapper;
using SchoolSystem.Application.Features.Students.DTOs.Create;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Application.Features.Students.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class StudentProfile : Profile
{
    public StudentProfile()
    {
        CreateMap<CreateStudentDto, Student>();
        CreateMap<UpdateStudentDto, Student>();

        CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.Class, opt => opt.MapFrom(src => src.Class))
            .ForMember(dest => dest.Section, opt => opt.MapFrom(src => src.Section))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
             .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : null));

        CreateMap<Class, ClassBasicInfoDto>();

        CreateMap<Section, SectionBasicInfoDto>();

        CreateMap<Parent, ParentBasicInfoDto>();
    }
}
