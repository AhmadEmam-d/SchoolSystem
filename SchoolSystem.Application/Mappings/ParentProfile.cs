using AutoMapper;
using SchoolSystem.Application.Features.Parents.DTOs.Create;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class ParentProfile : Profile
{
    public ParentProfile()
    {
        CreateMap<CreateParentDto, Parent>();
        CreateMap<UpdateParentDto, Parent>();

        CreateMap<Parent, ParentDto>()
            .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

        CreateMap<Student, StudentBasicInfoDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));
    }
}
