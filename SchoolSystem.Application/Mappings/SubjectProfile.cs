using AutoMapper;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Profiles
{
    public class SubjectProfile : Profile
    {
        public SubjectProfile()
        {
            CreateMap<Subject, SubjectResponseDto>()
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.FullName));

            CreateMap<CreateSubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();
        }
    }
}
